   var oModel = new sap.ui.model.json.JSONModel();
   oModel.setData({
       modelData: sdkComponentModel["basics"]
   });

   var oCarousel = new sap.ui.commons.Carousel();
   oCarousel.setOrientation("vertical");
   //oCarousel.setVisibleItems(10);
   oCarousel.setHeight("100%");
   oCarousel.setWidth("240px");
   oCarousel.setModel(oModel);
   var carouselItemHeight = 40;
   oCarousel.setDefaultItemHeight(carouselItemHeight);
   //2. Define a factory method for StandardTile elements (standardTileFactory).    
   var standardTileFactory = function(sId, oContext) {
       //bind all properties from https://sapui5.netweaver.ondemand.com/sdk/#docs/api/symbols/sap.m.StandardTile.html
       //except Type which had little effect Code:oTile.setType(sap.m.StandardTileType.Monitor);
       //+ include our id from the model as CustomData to the TreeNode

       var oTile = new sap.m.StandardTile(sId)
           .bindProperty("title", oContext.sPath + "/title")
           .bindProperty("info", oContext.sPath + "/info")
           .bindProperty("number", oContext.sPath + "/number")
           .bindProperty("numberUnit", oContext.sPath + "/numberUnit")
           .bindProperty("icon", oContext.sPath + "/icon")
           .addCustomData(new sap.ui.core.CustomData({
               key: "modelId",
               value: oContext.oModel.getProperty(oContext.sPath + "/id"),
               writeToDom: true
           }));

	var id = oContext.oModel.getProperty(oContext.sPath + "/id");
	   
	var ajaxcheckstatus = new org.scn.community.utils.PostResponseParser();
	var callback = function () {
		var response = ajaxcheckstatus.getDReturnResponse();

		response = response.substring(response.indexOf("=") + 1);
		var changeLog = [];

		try {
		    changeLog = JSON.parse(response);
		} catch (e) {
		    // alert(e);
		}

		var statusAll = undefined;

		for (index in changeLog) {
		    var sItem = changeLog[index];

			if (sItem["test-status"] == "ok" || sItem["test-status"] == "good" || sItem["test-status"] == "passed") {
				if (statusAll == undefined) statusAll = "ok";
			}

			if (sItem["test-status"] == "untested") {
				if (sItem.title != "Start of Change Log") {
					if (statusAll == undefined || statusAll == "ok") statusAll = "pending";
				}
			}

			if (sItem["test-status"] == "bad") {
				if (statusAll == undefined || statusAll == "ok" || statusAll == "pending") statusAll = "broken";
			}
		}
	    
	    if(statusAll == "ok") {
	    	oTile.addStyleClass("tileGreen");	
	    } else if(statusAll == "pending") {
	    	oTile.addStyleClass("tileYellow");	
	    } else {
		    if(changeLog.length > 1) {
			oTile.addStyleClass("tileRed");
		    }
	    }
	}
	requestAjaxJson("http://org-scn-design-studio-community.github.io/sdkhelp/web/components/"+id+"/changes/changelog.json", callback, ajaxcheckstatus);
	
       //Provide URI for icons
       var iconSrc = oContext.oModel.getProperty(oContext.sPath + "/icon");
       if (iconSrc) {
           oTile.setIcon(sap.ui.core.IconPool.getIconURI(iconSrc));
       }
       //activeIcon does not seem to be used currently. Consider removing for now
       var activeIconSrc = oContext.oModel.getProperty(oContext.sPath + "/activeIcon");
       if (iconSrc) {
           oTile.setActiveIcon(sap.ui.core.IconPool.getIconURI(activeIconSrc));
       }
       return oTile;

   };

   var standardEntryFactory = function(sId, oContext) {
       //bind all properties from https://sapui5.netweaver.ondemand.com/sdk/#docs/api/symbols/sap.m.StandardTile.html
       //except Type which had little effect Code:oTile.setType(sap.m.StandardTileType.Monitor);
       //+ include our id from the model as CustomData to the TreeNode

       var oLink = new sap.ui.commons.Link()
           .bindProperty("text", oContext.sPath + "/title")
           .bindProperty("tooltip", oContext.sPath + "/title");
       var oBadge = new sap.suite.ui.commons.BusinessCard({
           firstTitle: oLink,
           width: "100%",
           height: carouselItemHeight + "px"
       })

       .bindProperty("iconPath", oContext.sPath + "/icon")
           .bindProperty("secondTitle", oContext.sPath + "/title")
           .bindProperty("imageTooltip", oContext.sPath + "/title")
       oLink.attachPress(function() {
           var idLInk = oContext.getModel().getProperty(oContext.sPath + "/id");
           window.location = idLInk + ".html";
       });

       return oBadge;
   };

   //3. Define a method for dynamically populate the TreeNodes of a Tree based on its model (createDynamicTreeNodesFromModel)
   function createDynamicTilesFromModel(oTileContainer, modelPath) {
       if (oTileContainer.hasModel() == false) {
           console.log(oTileContainer + " has no model bound to it. Cannot create Tiles");
           return;
       }

       oTileContainer.bindAggregation("tiles", modelPath, standardTileFactory);
       oCarousel.bindAggregation("content", modelPath, standardEntryFactory);
   }

   //4. Create an event handler method for when a Tile is clicked
   function onMyTileClicked(oControlEvent) {
       //COMMON code for all event handlers
       var selectedId = oControlEvent.getParameter("id");
       var selectedModelId = null;

       var customDataList = oControlEvent.getSource().getCustomData();
       if (customDataList != null && customDataList.length == 1 && customDataList[0].getKey("modelId")) {
           modelId = customDataList[0].getValue("modelId");
       } else {
           console.log("modelId not bound as CustomData to the TreeNode");
       }

       //selectedId now refers to the TreeNode element
       //selectedModelId now refers to the id field from the model

       //SPECIFIC code for this Tree
       //just updates a TextView with the ids we have found. 
       // alert("onTileNodeClicked ModelId:" + modelId + " \nsapui5 component id:" + selectedId);
       try {
           window.location = modelId + ".html";
       } catch (e) {}
   }

   //5a. Create a TileContainer component
   //5b. Set the Model of the TileContainer component 
   var componentTile = new sap.m.TileContainer("componentTile");
   componentTile.setModel(oModel);

   //5c. Dynamically create TileNodes from the model
   createDynamicTilesFromModel(componentTile, "/modelData");

   //5d. Add event handler to all tiles 
   //Event handler is a different for each TileContainer)
   var tiles = componentTile.getTiles();
   if (tiles != null && tiles.length >= 1) {
       for (var i = 0; i < tiles.length; i++) {
           tiles[i].attachPress(onMyTileClicked);
       }
   }

   tree = {
       key: "",
       title: "Component Groups",
       nodes: [{
           key: "basics",
           title: "Basics"
       }, {
           key: "visualizations",
           title: "Visualizations"
       }, {
           key: "datasource",
           title: "Data Sources"
       }, {
           key: "utils",
           title: "Utilities (Non-UI)"
       }, {
           key: "framework",
           title: "Framework"
       }],
       leafs: []
   };

   // create a simple matrix layout with given sizes
   var stageUI = new sap.ui.commons.layout.MatrixLayout({
       id: "stageMatrix",
       layoutFixed: false,
       columns: 2,
       width: "100%",
       widths: ["160px", "100%"],
       height: "100%",
   });

   //   var stageUI = new sap.ui.commons.layout.VerticalLayout({
   //       width: "100%",
   //   });
   var strip = new sap.ui.ux3.NavigationBar({
       toplevelVariant: true,
       width: "100%"
   });

   var currentGroupLabel = new sap.ui.commons.Label({
       text: "...",
       design: sap.ui.commons.LabelDesign.Bold
   });
   currentGroupLabel.addStyleClass("groupLabel");

   for (var index in tree.nodes) {
       var stripItem = new sap.ui.ux3.NavigationItem({
           key: tree.nodes[index].key,
           text: tree.nodes[index].title,
       });
       strip.addItem(stripItem);

       if (stripItem.getKey() == "basics") {
           strip.setSelectedItem(stripItem);
           currentGroupLabel.setText(tree.nodes[index].title);
       }
   }

   strip.attachSelect(function(oControlEvent) {
       var selectedKey = oControlEvent.getParameters().item.getKey();
       oModel.setData({
           modelData: sdkComponentModel[selectedKey]
       });

       for (var ind in tree.nodes) {
           if (tree.nodes[ind].key == selectedKey) {
               currentGroupLabel.setText(tree.nodes[ind].title);
           }
       }

       componentTile.setModel(oModel);
       
       //5d. Add event handler to all tiles 
   //Event handler is a different for each TileContainer)
   var tiles = componentTile.getTiles();
   if (tiles != null && tiles.length >= 1) {
       for (var i = 0; i < tiles.length; i++) {
           tiles[i].attachPress(onMyTileClicked);
       }
   }
   }, this);

   componentTile.addStyleClass("org-scn-CompListTile");
   componentTile.setHeight("100%");

   var cellForList = new sap.ui.commons.layout.MatrixLayoutCell({
       id: "stageMatrixList",
       rowSpan: 1,
       height: "100%",
   });
   cellForList.addContent(oCarousel);
   stageUI.createRow({
       height: "50px"
   }, currentGroupLabel, strip);
   stageUI.createRow({
       height: "100%"
   }, cellForList, componentTile);
   stageUI.createRow({
       height: "30px"
   }, new sap.ui.commons.Label({
       text: "Scn Community Design Studio Compnents"
   }));

   var cellEmpty = new sap.ui.commons.layout.MatrixLayoutCell({
       id: "stageMatrixEmptyCell",
       colSpan: 2,
       height: "55px",
   });
   cellEmpty.addContent(new sap.ui.commons.Label({
       text: " "
   }));
   stageUI.createRow({
       height: "80px"
   }, cellEmpty);
   // stageUI.addContent(strip);
   // stageUI.addContent(componentTile);
   // stageUI.addContent(new sap.ui.commons.Label({text: "Scn Community Design Studio Compnents"}));
   // stageUI.setHeight("100%");
   // stageUI.addStyleClass("org-scn-CompListBody");
   stageUI.placeAt("content");

   (function(i, s, o, g, r, a, m) {
       i['GoogleAnalyticsObject'] = r;
       i[r] = i[r] || function() {
           (i[r].q = i[r].q || []).push(arguments)
       }, i[r].l = 1 * new Date();
       a = s.createElement(o),
           m = s.getElementsByTagName(o)[0];
       a.async = 1;
       a.src = g;
       m.parentNode.insertBefore(a, m)
   })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

   ga('create', 'UA-61231710-1', 'auto');
   ga('send', 'pageview');