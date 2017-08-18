var browser = new org.scn.community.basics.ModalBrowser({
        text:'About the Extensions',
	title:'Read About the Community Repository',
	url:'about.html',
	browserWidth:'930px',
	browserHeight:'430px',
	openMethod:'Modal Browser Dialog',
    });
    browser.initDesignStudio();
    browser.setShowButton(true);
    browser.setShowCloseButton(true);
    browser.placeAt('about');