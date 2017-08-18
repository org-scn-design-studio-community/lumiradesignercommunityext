var browser = new org.scn.community.basics.ModalBrowser({
        text:'Free Download 3.0',
	title:'Free Download of Community Components 3.0',
	url:'download.html',
	browserWidth:'730px',
	browserHeight:'370px',
	openMethod:'Modal Browser Dialog',
    });
    browser.initDesignStudio();
    browser.setShowButton(true);
    browser.setShowCloseButton(true);
    browser.setType(sap.m.ButtonType.Emphasized);
    browser.placeAt('download');