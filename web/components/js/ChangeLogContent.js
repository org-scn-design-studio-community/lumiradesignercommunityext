// requestChangeLog("../../../sdkhelp/web/components/basics/accordion/changes/changelog.json");
var model = {};
var globalChangeLog = [];

requestAjaxJson = function(url, callback, ajaxCall) {
    ajaxCall.initDesignStudio();

    ajaxCall.setDUrl(url);
    ajaxCall.setDRequestType("JQuery");
    ajaxCall.setDContentType("application/json");

    ajaxCall.setDRequestMethod("GET");
    ajaxCall.setDContentType("text/plain");
    ajaxCall.setDCrossDomain(true);

    ajaxCall.setDTrigger("GO");

    ajaxCall.fireDesignStudioPropertiesChanged = function() {};
    ajaxCall.fireDesignStudioEvent = callback;

    ajaxCall.afterDesignStudioUpdate();
}

var counter = 0;
var againCounter = 0;

requestChangeLogModel = function(url, id, name, model) {
    var ajaxCallChangeLog = new org.scn.community.utils.PostResponseParser();

    var callback = function(eventName) {
        var response = ajaxCallChangeLog.getDReturnResponse();

        response = response.substring(response.indexOf("=") + 1);
        var changeLog = [];

        try {
            changeLog = JSON.parse(response);
        } catch (e) {
            // alert(e);
        }

        model[id] = {};
        model[id].changelog = changeLog;
        model[id].name = name;

        againCounter = againCounter + 1;

        for (index in changeLog) {
            var change = changeLog[index];

            change.compId = id;
            change.component = name;
            if (change.filterValue != "creation") {
                change.filterValue = change["test-status"] + "/" + change.filterValue;
                change.author = name + ": (" + change.author + ")";
                globalChangeLog.push(change);
            }
        }

        if (counter == againCounter) {
            setTimeout(function() {
                updateGlobal()
            }, 1000);
        }
    };

    requestAjaxJson(url, callback, ajaxCallChangeLog);
}

for (group in sdkComponentModel) {
    var components = sdkComponentModel[group];

    if(group != "prototypes") {
	counter = counter + components.length;    
    }
}
for (group in sdkComponentModel) {
    var components = sdkComponentModel[group];

    for (compI in components) {
        var comp = components[compI];

	// collect only non-prototypes
	if(comp.id.indexOf("prototypes") == -1) {
		requestChangeLogModel("../../../sdkhelp/web/components/" + comp.id + "/changes/changelog.json", comp.id.replace("/", "_"), comp.title, model);
	}
    }
}

var statusAll = undefined;
var dateAll = undefined;


itemFactory = function(sId, sModel) {
    var sItem = sModel.getObject(sModel.sPath);
    var sDate = sItem.date;

    var sDateToParse = sDate.split("-");
    var realDate = new Date(sDateToParse[0], sDateToParse[1] - 1, sDateToParse[2])

    if (dateAll == undefined) dateAll = realDate;

    var link = "https://github.com/org-scn-design-studio-community/sdkhelp/tree/master/web/components/" + sItem.compId.replace("_", "/");
    var linkToRepo = new sap.ui.commons.Link({
        text: " -> open change log in sdhhelp repository",
        press: function() {
            window.open(link + "/changes/changelog.json", '_blank');
        }
    });

    var horLayout = new sap.ui.layout.HorizontalLayout({
	    content: [
		new sap.ui.commons.Label({
                    text: "Change Details & Test Status ",
                    design: sap.ui.commons.LabelDesign.Bold,
                }),
		new sap.ui.commons.Label({
                    text: " ",
			width: "20px",
                    design: sap.ui.commons.LabelDesign.Bold,
                }),
		linkToRepo
	    ]
    });
    var tlItem = new sap.suite.ui.commons.TimelineItem({
        dateTime: realDate,
        userNameClickable: false,
        text: "{text}",
        userName: "{author}",
        title: "{title}",
        filterValue: "{filterValue}",
        icon: "{icon}",
        embeddedControl: new sap.ui.layout.VerticalLayout({
            content: [
		horLayout,
                new sap.ui.commons.Label({
                    text: "{text}",
                    icon: "{icon}",
                }),
                new sap.ui.commons.Label({
                    text: "{test-comment}",
                    icon: "{test-icon}",
                })
            ]
        })
    });

    tlItem.addStyleClass("resizeTimelineItemMed");

    if (sItem["test-status"] == "ok" || sItem["test-status"] == "good" || sItem["test-status"] == "passed") {
        tlItem.addStyleClass("greenTimelineItem");
        if (statusAll == undefined) statusAll = "ok";
    }

    if (sItem["test-status"] == "untested") {
        if (sItem.title != "Start of Change Log") {
            tlItem.addStyleClass("yellowTimelineItem");
            if (statusAll == undefined || statusAll == "ok") statusAll = "pending";
        }
    }

    if (sItem["test-status"] == "bad") {
        tlItem.addStyleClass("redTimelineItem");
        if (statusAll == undefined || statusAll == "ok" || statusAll == "pending") statusAll = "broken";
    }

    return tlItem;
}

var timeline = new sap.suite.ui.commons.Timeline();
timeline.setSortOldestFirst(false);
timeline.setWidth("100%");
timeline.setGrowingThreshold(3);
timeline.setGrowing(true);

var timelineStatus = new sap.suite.ui.commons.Timeline();
timelineStatus.removeAllFilterList();
timelineStatus.setEnableScroll(false);
timelineStatus.setShowHeaderBar(false);

updateGlobal = function() {
    var oModel = new sap.ui.model.json.JSONModel({
        values: globalChangeLog
    });

    timeline.setModel(oModel);
    timeline.bindAggregation("content", {
        path: "/values",
        // template: tlItem
        factory: itemFactory
    });

    var statusItem = new sap.suite.ui.commons.TimelineItem({
        dateTime: dateAll,
        userNameClickable: false,
        userName: "Status Generator, ",
    });

    statusItem.addStyleClass("resizeTimelineItemMed");
    if (statusAll == "ok") {
        statusItem.addStyleClass("greenTimelineItem");
        statusItem.setTitle("SCN Repository Status is Green, all changes have been validated");
        statusItem.setText("this means, this component is up to date and fully functional");
        statusItem.setIcon("sap-icon://accept");
    }

    if (statusAll == "pending") {
        statusItem.addStyleClass("yellowTimelineItem");
        statusItem.setTitle("Current SCN Repository Status is Yellow, some changes have are not yet validated, see change log");
        statusItem.setText("this means, some components are up to date and can be used, but some still need confirmation and retest");
        statusItem.setIcon("sap-icon://flag");
    }

    if (statusAll == "broken") {
        statusItem.addStyleClass("redTimelineItem");
        statusItem.setTitle("Current SCN Repository Status is Red, some changes are validated with negative result, see change log");
        statusItem.setText("this means, some component is currently broken, it can be partly or fully broken, if you use it - wait on correction");
        statusItem.setIcon("sap-icon://shield");
    }
    timelineStatus.addContent(statusItem);
};

var timelineUI = new sap.ui.commons.layout.MatrixLayout({
    id: "changeMatrix",
    layoutFixed: true,
    columns: 1,
    width: "100%",
    widths: ["100%"],
    height: "100%",
});

timelineUI.createRow({
    height: "620px"
}, timeline);

timelineUI.placeAt("changelogcontent");
timelineStatus.placeAt("globalstatus");