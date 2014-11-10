define([
    'common/SingletonDataSource', './MenuModel'
], function(SingletonDataSource, MenuModel) {
    var MenuDataSource = SingletonDataSource.define({
        name: "MenuDataSource",
        parameters: {
            transport: {
                read: {
                    type: "GET",
                    url: AdminApp.getBackendURL() + "menu/all",
                    dataType: "json",
                    contentType: "application/json"
                },
                update: {
                    type: "POST",
                    url: AdminApp.getBackendURL() + "menu",
                    dataType: "json",
                    contentType: "application/json"
                },
                destroy: {
                    type: "DELETE",
                    url: AdminApp.getBackendURL() + "menu",
                    dataType: "json",
                    contentType: "application/json"
                },
                create: {
                    type: "PUT",
                    url: AdminApp.getBackendURL() + "menu",
                    dataType: "json",
                    contentType: "application/json"
                },
                parameterMap: function(options, operation) {
                    if (operation !== "read") {
                        return kendo.stringify(options);
                    }
                }
            },
            batch: false,
            pageSize: 20,
            schema: {
                model: MenuModel
            }
        }
    });
    return MenuDataSource;
});