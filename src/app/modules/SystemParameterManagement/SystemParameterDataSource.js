define([
    'common/SingletonDataSource', './SystemParameterModel'
], function (SingletonDataSource, SystemParameterModel) {
    var SystemParameterDataSource = SingletonDataSource.define({
        name: "SystemParameterDataSource",
        parameters: {
            transport: {
                read: {
                    type: "GET",
                    url: AdminApp.getBackendURL() + "systemparameters",
                    dataType: "json",
                    contentType: "application/json"
                },
                update: {
                    type: "PUT",
                    url: AdminApp.getBackendURL() + "systemparameters",
                    dataType: "json",
                    contentType: "application/json"
                },
                destroy: {
                    type: "DELETE",
                    url: AdminApp.getBackendURL() + "systemparameters",
                    dataType: "json",
                    contentType: "application/json"
                },
                create: {
                    type: "POST",
                    url: AdminApp.getBackendURL() + "systemparameters",
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
                model: SystemParameterModel
            }
        }
    });
    return SystemParameterDataSource;
});