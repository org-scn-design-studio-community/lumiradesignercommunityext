var oButtonPreview = new sap.ui.commons.Button({
	text : "Preview Version 1.0",
	height: "40px",
	width: "140px",
	style: sap.ui.commons.ButtonStyle.Emph,
	press : function() {tC('http://org-scn-design-studio-community.github.io/sdkinstall/releases/10/preview', 'Preview Repo 1.0'); return false;}
});

var oButtonStable = new sap.ui.commons.Button({
	text : "Stable Version 1.0",
	height: "40px",
	width: "140px",
	style: sap.ui.commons.ButtonStyle.Accept,
	press : function() {tC('http://org-scn-design-studio-community.github.io/sdkinstall/releases/10/stable', 'Stable Repo 1.0'); return false;}
});

var oPanelOn = new sap.ui.commons.Panel({width: "25px", showCollapseIcon: false});
oPanelOn.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
oPanelOn.setBorderDesign(sap.ui.commons.enums.BorderDesign.None);

var oLayout = new sap.ui.layout.HorizontalLayout("LayoutOnline", {
	content: [oButtonPreview, oPanelOn, oButtonStable]
}).placeAt("online-download");;


var oButtonPreviewOffline = new sap.ui.commons.Button({
	text : "Preview Version 1.0",
	height: "40px",
	width: "140px",
	style: sap.ui.commons.ButtonStyle.Emph,
	press : function() {tOL('http://raw.githubusercontent.com/org-scn-design-studio-community/sdkinstall/master/releases/10/preview/org.scn.community.sdk.package_preview.zip', 'Preview ZIP 1.0'); return false;}
});

var oButtonStableOffline = new sap.ui.commons.Button({
	text : "Stable Version 1.0",
	height: "40px",
	width: "140px",
	style: sap.ui.commons.ButtonStyle.Accept,
	press : function() {tOL('http://raw.githubusercontent.com/org-scn-design-studio-community/sdkinstall/master/releases/10/stable/org.scn.community.sdk.package_stable.zip', 'Stable ZIP 1.0'); return false;}
});

var oPanelOff = new sap.ui.commons.Panel({width: "25px", showCollapseIcon: false});
oPanelOff.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
oPanelOff.setBorderDesign(sap.ui.commons.enums.BorderDesign.None);

var oLayout = new sap.ui.layout.HorizontalLayout("LayoutOffline", {
	content: [oButtonPreviewOffline, oPanelOff, oButtonStableOffline]
}).placeAt("offline-download");;