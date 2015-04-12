define([
    'text!./SideMenu.html',
    'text!./SideMenuItem.html',
    'text!./SideMenuSubItem.html',

    'robe/view/RobeView'
], function (view, itemView, subItemView) {
    var SideMenu = require('robe/view/RobeView').define({
        name: "SideMenu",
        html: view,
        containerId: "sidebar-left",
        items: null,
        initialize: function () {
            var container = $('#' + this.containerId);

            var renderedItems = container.find('#items');
            renderedItems.html("");

            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var renderedItem = $(itemView);
                var icon = renderedItem.find('#itemIcon');
                icon.attr("class", icon.attr("class") + item.command);

                renderedItem.find('a').click(this.onItemClick);
                renderedItem.find('a').attr("oid", "item" + i);
                var renderedSubItems = renderedItem.find('#itemSubItems');
                renderedItem.find('#itemName').html(item.text);
                var subItems = item['items'];
                for (var j = 0; j < subItems.length; j++) {
                    var renderedSubItem = $(subItemView);
                    renderedSubItem.find('#itemRef').attr("href", "#/" + subItems[j].command);
                    var name = renderedSubItem.find('#itemName');
                    var icon = renderedSubItem.find('#itemIcon');

                    name.html(subItems[j].text);
                    renderedSubItem.find('a').click(this.onSubItemClick);
                    renderedSubItem.find('a').attr("parentOid", "item" + i);
                    renderedSubItem.find('a').attr("oid", "subitem" + j);
                    icon.attr("class", icon.attr("class") + subItems[j].command);
                    renderedSubItems.append(renderedSubItem);

                }
                renderedItems.append(renderedItem);
            }

        },
        currentItem:null,
        currentSubItem:null,
        onItemClick: function (e) {
            e.preventDefault();
            var selected = $(e.target).closest("a");
            if (SideMenu.currentItem != null) {
                if (selected.attr("oid") == SideMenu.currentItem.attr("oid"))
                    return;
            }
            var subItems = $('#items').find("#itemSubItems:visible");
            for (var i = 0; i < subItems.length; i++) {
                $(subItems[i]).hide();
            }
            var item = $(e.target).parent('#itemCommand').parent().find('#itemSubItems');
            if (item.length == 0) {
                item = $(e.target).parent().find('#itemSubItems');
            }

            SideMenu.currentItem = selected;
            item.fadeToggle(200)
        },
        onSubItemClick: function (e) {
            e.preventDefault();
            var selected = $(e.target).closest("a");

            if (SideMenu.currentSubItem != null) {
                if (selected.attr("oid") == SideMenu.currentSubItem.attr("oid"))
                    return;
                SideMenu.currentSubItem.removeClass("submenuitem-selected")
            }
            selected.addClass("submenuitem-selected")
            if (e.target.tagName == 'I' || e.target.tagName == 'i') {
                $('#lblContainerTitle').text($(e.target).siblings('span').text());

            } else {
                $('#lblContainerTitle').text($(e.target).text());
            }
            SideMenu.currentSubItem = selected;
            $("[oid='" + selected.attr("parentOid") + "']").click();
            window.location.href = selected.attr("href");
            return false;
        },
        syncMenu2Url: function () {
            var selected = $("[href='" + window.location.hash + "']");
            if (selected.length != 0) {
                $(selected[0]).click();
            }
        }
    });

    return SideMenu;
});