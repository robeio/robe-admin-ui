define([
    'common/SingletonDataSource', './UserModel'
], function (SingletonDataSource, UserModel) {

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
                    contentType: "application/json",
                    success: function (data, x, r) {
                        console.log(data);
                        console.log(x);
                        console.log(r);
                    }
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
                    contentType: "application/json",
                    complete: function (data, status) {
                        if (status === "success") {
                            var response = JSON.parse(data.responseText);
                            if (response.newPassword) {
                                var wnd = $('#showUserPassword').kendoWindow({
                                    actions: ['close'],
                                    modal: true,
                                    visible: false,
                                    minHeight: 100,
                                    minWidth: 300
                                }).data("kendoWindow");

                                wnd.title("Lütfen Yanınıza Not alınız");
                                wnd.content("Kullanıcınızın Şifresi: <b>" + response.newPassword + "</b>");
                                wnd.open().center();
                            }
                        }
                    }
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
                model: UserModel
            }
        }
    });
    return UserDataSource;
});