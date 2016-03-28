define([
    'common/SingletonDataSource', './MenuModel'
], function(SingletonDataSource, MenuModel) {
    var MenuDataSource = SingletonDataSource.define({
        name: "MenuDataSource",
        parameters: {
            transport: {
                read: {
                    type: "GET",
                    url: AdminApp.getBackendURL() + "menus",
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        console.log(data)
                    }
                },
                update: {
                    type: "PUT",
                    url: AdminApp.getBackendURL() + "menus",
                    dataType: "json",
                    contentType: "application/json"
                },
                destroy: {
                    type: "DELETE",
                    url: AdminApp.getBackendURL() + "menus",
                    dataType: "json",
                    contentType: "application/json"
                },
                create: {
                    type: "POST",
                    url: AdminApp.getBackendURL() + "menus",
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