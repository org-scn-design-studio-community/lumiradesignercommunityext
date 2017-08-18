var browser = new org.scn.community.basics.ModalBrowser({
        text:'Change Log 2.0',
	title:'Status & Change Log of Release 2.0',
	url:'changelog.html',
	browserWidth:'1200px',
	browserHeight:'780px',
	openMethod:'Modal Browser Dialog',
    });
    browser.initDesignStudio();
    browser.setShowButton(true);
    browser.setShowCloseButton(true);
    browser.setType(sap.m.ButtonType.Default);
    browser.placeAt('changelog');