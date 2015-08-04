define([
    'text!./SystemParameterManagement.html',
    './SystemParameterDataSource',
    'kendo/kendo.grid.min',
    'robe/view/RobeView'
], function (html, SystemParameterDataSource) {

    var SystemParameterManagementView = require('robe/view/RobeView').define({
        name: "SystemParameterManagementView",
        html: html,
        containerId: "container",
        initialize: function () {

            i18n.init("SystemParameterManagement");

            $("#gridSystemParameters").kendoGrid({
                dataSource: SystemParameterDataSource.get(),
                sortable: true,
                pageable: {
                    refresh: true
                },
                toolbar: [
                    {
                        name: "create",
                        text: "Yeni Ekle".i18n()
                    }
                ],
                columns: [
                    {
                        field: "key",
                        title: "Etiket".i18n()
                    },
                    {
                        field: "value",
                        title: "Değer".i18n()
                    },
                    {
                        command: [
                            {
                                name: "edit",
                                text: {
                                    edit: "",
                                    update: "",
                                    cancel: ""
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
                        width: "120px"
                    }
                ],
                editable: {
                    mode: "inline",
                    window: {
                        title: "Kayıt".i18n()
                    },
                    confirmation: "Silmek istediğinizden emin misiniz?".i18n(),
                    confirmDelete: "Yes"
                }
            });

            i18n.translate();
        }
    });

    return SystemParameterManagementView;
});