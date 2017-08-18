tree = {
    key: "",
    title: "Component Areas",
    nodes: [{
        key: "back",
        title: "<- Back To List"
    }, {
        key: "intro",
        title: "Introduction"
    }, {
        key: "blogs",
        title: "Blogs"
    }, {
        key: "technical",
        title: "Technical Specification"
    }, {
        key: "examples",
        title: "Examples"
    }, {
        key: "changelog",
        title: "Change Log"
    }, {
        key: "about",
        title: "About"
    }],
    leafs: []
};

var strip = new sap.ui.ux3.NavigationBar({
    toplevelVariant: true,
    width: "100%"
});
for (var index in tree.nodes) {
    var stripItem = new sap.ui.ux3.NavigationItem({
        key: tree.nodes[index].key,
        text: tree.nodes[index].title,
    });
    strip.addItem(stripItem);

    if (stripItem.getKey() == "intro") {
        strip.setSelectedItem(stripItem);
    }
}

strip.attachSelect(function(oControlEvent) {
    var selectedKey = oControlEvent.getParameters().item.getKey();

    if (selectedKey == "back") {
        document.location = "../list.html";
    } else {
        for (var index in tree.nodes) {
            var key = tree.nodes[index].key;
            if (key != "back" && key != selectedKey) {
                var el = document.getElementById(key);
                if (el) {
                    el.hidden = true;
                }
            }
            if (key == selectedKey) {
                var el = document.getElementById(key);
                if (el) {
                    el.hidden = false;
                }
            }
        }
    }
}, this);
strip.placeAt('componentnav');