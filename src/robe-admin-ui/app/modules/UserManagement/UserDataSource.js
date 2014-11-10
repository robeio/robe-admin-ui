define([
    'common/SingletonDataSource', './UserModel'
], function(SingletonDataSource, UserModel) {

    var UserDataSource = SingletonDataSource.define({
        name: "UserDataSource",
        parameters: {
            transport: {
                read: {
                    type: "GET",
                    url: AdminApp.getBackendURL() + "user/all",
                    dataType: "json",
                    contentType: "application/json"
                },
                update: {
                    type: "POST",
                    url: AdminApp.getBackendURL() + "user",
                    dataType: "json",
                    contentType: "application/json"
                },
                destroy: {
                    type: "DELETE",
                    url: AdminApp.getBackendURL() + "user",
                    dataType: "json",
                    contentType: "application/json"
                },
                create: {
                    type: "PUT",
                    url: AdminApp.getBackendURL() + "user",
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
                model: UserModel
            }
        }
    });
    return UserDataSource;
});