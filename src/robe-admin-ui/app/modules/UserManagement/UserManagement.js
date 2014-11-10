define([
    'text!./UserManagement.html',
    './UserDataSource',
    '../RoleManagement/RoleDataSource',
    'kendo/kendo.grid.min',
    'kendo/kendo.window.min',
    'robe/view/RobeView'
], function(html, UserDataSource, RoleDataSource) {
    var UserManagementView = require('robe/view/RobeView').define({
        name: "UserManagementView",
        html: html,
        containerId: "container",
        initialize: function() {
            $("#gridUsers").kendoGrid({
                dataSource: UserDataSource.get(),
                sortable: true,
                autoBind: false,
                pageable: {
                    refresh: true
                },
                toolbar: [{
                    name: "create",
                    text: "Yeni Kullanıcı"
                }],
                columns: [{
                    field: "name",
                    title: "Ad"

                }, {
                    field: "surname",
                    title: "Soyad"
                }, {
                    field: "email",
                    title: "E-posta"
                }, {
                    field: "roleOid",
                    title: "Rol",
                    editor: userRoleDropDownEditor,
                    hidden: true
                }, {
                    field: "active",
                    title: "Aktif mi?",
                    template: "#= (active)? 'Evet':'Hayır'#"
                }, {
                    command: [{
                        name: "edit",
                        text: {
                            edit: "",
                            update: "Güncelle",
                            cancel: "İptal"
                        },
                        className: "grid-command-iconfix"
                    }, {
                        name: "destroy",
                        text: "",
                        className: "grid-command-iconfix"
                    }],
                    title: "&nbsp;",
                    width: "80px"
                }],
                editable: {
                    mode: "popup",
                    window: {
                        title: "Kayıt"
                    },
                    confirmation: "Silmek istediğinizden emin misiniz?",
                    confirmDelete: "Yes"
                }
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