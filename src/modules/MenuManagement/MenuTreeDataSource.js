define([
    './MenuTreeModel',
    'kendo/kendo.data.min'
], function (MenuTreeModel) {
    var MenuTreeDataSource = new kendo.data.HierarchicalDataSource({
        transport: {
            read: {
                type: "GET",
                url: Application.getBackendURL() + "menu/roots",
                dataType: "json",
                contentType: "application/json"
            },
            update: {
                type: "POST",
                url: Application.getBackendURL() + "menu",
                dataType: "json",
                contentType: "application/json"
            },
            destroy: {
                type: "DELETE",
                url: Application.getBackendURL() + "menu",
                dataType: "json",
                contentType: "application/json"
            },
            create: {
                type: "PUT",
                url: Application.getBackendURL() + "menu",
                dataType: "json",
                contentType: "application/json"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read") {
                    return kendo.stringify(options);
                }
            }
        },
        batch: false,
        pageSize: 20,
        schema: {
            model: MenuTreeModel
        }
    });
    return MenuTreeDataSource;
});