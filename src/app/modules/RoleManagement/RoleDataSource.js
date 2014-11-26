define([
    'common/SingletonDataSource', './RoleModel'
], function(SingletonDataSource, RoleModel) {
    var RoleDataSource = SingletonDataSource.define({
        name: "RoleDataSource",
        parameters: {
            transport: {
                read: {
                    type: "GET",
                    url: AdminApp.getBackendURL() + "role/all",
                    dataType: "json",
                    contentType: "application/json"
                },
                update: {
                    type: "POST",
                    url: AdminApp.getBackendURL() + "role",
                    dataType: "json",
                    contentType: "application/json"
                },
                destroy: {
                    type: "DELETE",
                    url: AdminApp.getBackendURL() + "role",
                    dataType: "json",
                    contentType: "application/json"
                },
                create: {
                    type: "PUT",
                    url: AdminApp.getBackendURL() + "role",
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
                model: RoleModel
            }
        }
    });
    return RoleDataSource;
});