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

requestContent = function(what, url) {
	var ajaxCallBlogs = new org.scn.community.utils.PostResponseParser();

	var callback = function(eventName) {
        var response = ajaxCallBlogs.getDReturnResponse();

        response = response.substring(response.indexOf("=") + 1);
        var blogs = JSON.parse(response);

        var oModel = new sap.ui.model.json.JSONModel({
            values: blogs
        });

        itemFactory = function(sId, sModel) {
            var sItem = sModel.getObject(sModel.sPath);
            var sDate = sItem.date;

            var sDateToParse = sDate.split("-");
            var realDate = new Date(sDateToParse[0], sDateToParse[1]-1, sDateToParse[2])

            var urlLink = new sap.ui.commons.Link({
                text: "Open "+what+" in New Window",
            });
            
            urlLink.attachPress(function (event){
    			var url = sItem.link;
    			window.open(url,'_blank');
            });
            
            var tlItem = new sap.suite.ui.commons.TimelineItem({
                dateTime: realDate,
                userNameClickable: true,
                text: "{text}",
                userName: "{author}",
                title: "{title}",
                filterValue: "{filterValue}",
                icon: "{icon}",
                embeddedControl: new sap.ui.layout.VerticalLayout({
                    content: [
                        new sap.ui.commons.Label({
                            text: what+" Summary:",
                            design: sap.ui.commons.LabelDesign.Bold,
                        }),
                        new sap.ui.commons.Label({
                            text: "{text}",
                        }),
                        urlLink,
                    ]
                })
            });
            
            tlItem.addStyleClass("resizeTimelineItem");
            tlItem.addStyleClass("blueTimelineItem");

            tlItem.attachUserNameClicked(function(oControlEvent) {
    			var url = sItem.authorLink;
    			window.open(url,'_blank');
    		});

            return tlItem;
        }

        var timeline = new sap.suite.ui.commons.Timeline();
        timeline.setModel(oModel);
        timeline.bindAggregation("content", {
            path: "/values",
            factory: itemFactory
        });

        timeline.setSortOldestFirst(false);
        timeline.setWidth("100%");

        var timelineUI = new sap.ui.commons.layout.MatrixLayout({
            id: what+"Matrix",
            layoutFixed: true,
            columns: 1,
            width: "100%",
            widths: ["100%"],
            height: "100%",
        });

        timelineUI.createRow({
            height: "100%"
        }, timeline);

        var cellEmpty = new sap.ui.commons.layout.MatrixLayoutCell({
            id: what+"sMatrixEmptyCell",
            colSpan: 2,
            height: "55px",
        });
        cellEmpty.addContent(new sap.ui.commons.Label({
            text: " "
        }));
        timelineUI.createRow({
            height: "55px"
        }, cellEmpty);

        timelineUI.placeAt(what+"sList");
	};
	
	requestAjaxJson(url, callback, ajaxCallBlogs);
};

requestChangeLog = function(url) {
    var ajaxCallChangeLog = new org.scn.community.utils.PostResponseParser();

    var callback = function(eventName) {
        var response = ajaxCallChangeLog.getDReturnResponse();

        response = response.substring(response.indexOf("=") + 1);
        var changeLog = JSON.parse(response);

        var oModel = new sap.ui.model.json.JSONModel({
            values: changeLog
        });

        var statusAll = undefined;
        var dateAll = undefined;

        itemFactory = function(sId, sModel) {
            var sItem = sModel.getObject(sModel.sPath);
            var sDate = sItem.date;

            var sDateToParse = sDate.split("-");
            var realDate = new Date(sDateToParse[0], sDateToParse[1], sDateToParse[2])

            if (dateAll == undefined) dateAll = realDate;
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
                        new sap.ui.commons.Label({
                            text: "Change Details:",
                            design: sap.ui.commons.LabelDesign.Bold,
                        }),
                        new sap.ui.commons.Label({
                            text: "{text}",
                            icon: "{icon}",
                        }),
                        new sap.ui.commons.Label({
                            text: "Test Status:",
                            design: sap.ui.commons.LabelDesign.Bold,
                        }),
                        new sap.ui.commons.Label({
                            text: "{test-comment}",
                            icon: "{test-icon}",
                        }),
                    ]
                })
            });

            tlItem.addStyleClass("resizeTimelineItem");

            if (sItem["test-status"] == "ok" || sItem["test-status"] == "good" || sItem["test-status"] == "passed") {
                tlItem.addStyleClass("greenTimelineItem");
                if (statusAll == undefined) statusAll = "ok";
            }

            if (sItem["test-status"] == "untested") {
		    if(sItem.title != "Start of Change Log") {
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
        timeline.setModel(oModel);
        timeline.bindAggregation("content", {
            path: "/values",
            // template: tlItem
            factory: itemFactory
        });

        timeline.setSortOldestFirst(false);
        timeline.setWidth("100%");

        var timelineStatus = new sap.suite.ui.commons.Timeline();
        var statusItem = new sap.suite.ui.commons.TimelineItem({
            dateTime: dateAll,
            userNameClickable: false,
            userName: "Status Generator, ",
        });
        statusItem.addStyleClass("resizeTimelineItemSmall");
        if (statusAll == "ok") {
            statusItem.addStyleClass("greenTimelineItem");
            statusItem.setTitle("Current Component Status is Green, all changes have been validated");
            statusItem.setText("this means, this component is up to date and fully functional");
            statusItem.setIcon("sap-icon://accept");
        }

        if (statusAll == "pending") {
            statusItem.addStyleClass("yellowTimelineItem");
            statusItem.setTitle("Current Component Status is Yellow, some changes have are not yet validated, see change log");
            statusItem.setText("this means, this component is up to date and can be used, but some last changes still need confirmation and retest");
            statusItem.setIcon("sap-icon://flag");
        }

        if (statusAll == "broken") {
            statusItem.addStyleClass("redTimelineItem");
            statusItem.setTitle("Current Component Status is Red, some changes are validated with negative result, see change log");
            statusItem.setText("this means, this component is currently broken, it can be partly or fully broken, if you use it - wait on correction");
            statusItem.setIcon("sap-icon://shield");
        }
        timelineStatus.addContent(statusItem);

        var timelineUI = new sap.ui.commons.layout.MatrixLayout({
            id: "changeMatrix",
            layoutFixed: true,
            columns: 1,
            width: "100%",
            widths: ["100%"],
            height: "100%",
        });

        timelineUI.createRow({
            height: "100%"
        }, timeline);

        var cellEmpty = new sap.ui.commons.layout.MatrixLayoutCell({
            id: "changeMatrixEmptyCell",
            colSpan: 2,
            height: "55px",
        });
        cellEmpty.addContent(new sap.ui.commons.Label({
            text: " "
        }));
        timelineUI.createRow({
            height: "55px"
        }, cellEmpty);

        timelineUI.placeAt("changelogList");
        timelineStatus.placeAt("introStatus");
    };

    requestAjaxJson(url, callback, ajaxCallChangeLog);
};