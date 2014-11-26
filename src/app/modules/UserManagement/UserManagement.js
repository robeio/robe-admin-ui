define([
    'text!./UserManagement.html',
    './UserDataSource',
    '../RoleManagement/RoleDataSource',
    'kendo/kendo.grid.min',
    'kendo/kendo.window.min',
    'robe/view/RobeView'
], function (html, UserDataSource, RoleDataSource) {
    var UserManagementView = require('robe/view/RobeView').define({
        name: "UserManagementView",
        html: html,
        containerId: "container",
        initialize: function () {
            var emailUserRegisterWindow = $("#emailUserRegister").kendoWindow({
                width: 260,
                modal: true,
                height: 180,
                resizable: false,
                title: "Kayıt için mail giriniz"
            }).data("kendoWindow");


            var roleDropdown = $("#user-role-register")
                .kendoDropDownList({
                    autoBind: false,
                    dataTextField: "name",
                    dataValueField: "oid",
                    text: "Seçiniz...",
                    dataSource: RoleDataSource.get(),
                    placeholder: "Seçiniz...",
                    index: -1
                }).data("kendoDropDownList");


            $("#gridUsers").kendoGrid({
                dataSource: UserDataSource.get(),
                sortable: true,
                autoBind: false,
                pageable: {
                    refresh: true
                },
                toolbar: [
                    {
                        name: "create",
                        text: "Yeni Kullanıcı"
                    },
                    {
                        name: "email-request",
                        text: "Email ile kayıt yap",
                        imageClass: "k-icon k-i-pencil"
                    }
                ],
                columns: [
                    {
                        field: "name",
                        title: "Ad"

                    },
                    {
                        field: "surname",
                        title: "Soyad"
                    },
                    {
                        field: "email",
                        title: "E-posta"
                    },
                    {
                        field: "roleOid",
                        title: "Rol",
                        editor: userRoleDropDownEditor,
                        hidden: true
                    },
                    {
                        field: "active",
                        title: "Aktif mi?",
                        template: "#= (active)? 'Evet':'Hayır'#"
                    },
                    {
                        command: [
                            {
                                name: "edit",
                                text: {
                                    edit: "",
                                    update: "Güncelle",
                                    cancel: "İptal"
                                },
                                className: "grid-command-iconfix"
                            },
                            {
                                name: "destroy",
                                text: "",
                                className: "grid-command-iconfix"
                            }
                        ],
                        title: "&nbsp;",
                        width: "80px"
                    }
                ],
                editable: {
                    mode: "popup",
                    window: {
                        title: "Kayıt"
                    },
                    confirmation: "Silmek istediğinizden emin misiniz?",
                    confirmDelete: "Yes"
                }
            });
            $(".k-grid-email-request", "#gridUsers").bind("click", function (ev) {
                var alert = $("#alert");
                alert.removeClass("k-block k-error-colored");
                alert.html("");
                $("#user-email-register").val("");
                roleDropdown.value("");
                emailUserRegisterWindow.center().open();
            });

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            $("#user-email-register-update").bind("click", function (ev) {
                var email = $("#user-email-register").val();
                var alert = $("#alert");
                var roleOid = roleDropdown.value();
                if (!validateEmail(email)) {
                    alert.html("Mail adresi geçerli değil");
                    alert.addClass("k-block k-error-colored");
                    alert.show();
                    return;
                }
                if (!roleOid) {
                    alert.html("Lütfen rol Seçiniz");
                    alert.addClass("k-block k-error-colored");
                    alert.show();
                    return;
                }

                $.ajax({
                    type: "POST",
                    url: AdminApp.getBackendURL() + "user/emailRequest",
                    data: {
                        email: email,
                        roleOid: roleDropdown.value()
                    },
                    success: function (response) {
                        showToast("success", "Mail başarıyla gönderildi.");
                        emailUserRegisterWindow.close();

                    },
                    error: function (request) {
                        emailUserRegisterWindow.close();
                    }
                });

            });
            $("#user-email-register-cancel").bind("click", function (ev) {
                emailUserRegisterWindow.close();
            });


            function userRoleDropDownEditor(container, options) {
                $('<input required  data-text-field="name" data-value-field="oid"  data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: false,
                        dataTextField: "name",
                        dataValueField: "oid",
                        text: "Seçiniz...",
                        dataSource: RoleDataSource.get(),
                        placeholder: "Seçiniz...",
                        index: -1
                    });
            };

        }
    });

    return UserManagementView;
});