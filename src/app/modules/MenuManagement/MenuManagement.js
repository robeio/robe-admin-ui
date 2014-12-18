define([
    'text!./MenuManagement.html',
    './MenuDataSource',
    './MenuTreeModel',
    'kendo/kendo.grid.min',
    'kendo/kendo.window.min',
    'kendo/kendo.treeview.min',
    'robe/view/RobeView'
], function (view, MenuDataSource, MenuTreeModel) {

    var MenuManagementView = require('robe/view/RobeView').define({
        name: "MenuManagementView",
        html: view,
        containerId: "container",

        initialize: function () {
            i18n.init("MenuManagement");

            $("#gridMenus").kendoGrid({
                dataSource: MenuDataSource.get(),
                sortable: true,
                resizable: true,
                pageable: {
                    refresh: true
                },
                toolbar: [{
                    name: "create",
                    text: "Yeni Menü".i18n()
                }],
                columns: [{
                    field: "name",
                    title: "Ad".i18n(),
                    width: "110px"
                }, {
                    field: "code",
                    title: "Kod".i18n(),
                    width: "110px"
                }, {
                    command: [{
                        name: "edit",
                        text: {
                            edit: "",
                            update: "Güncelle".i18n(),
                            cancel: "İptal".i18n()
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
                group: {
                    field: "parentOid",
                    aggregates: [{
                        field: "oid",
                        aggregate: "count"
                    }]
                },
                editable: {
                    mode: "popup",
                    window: {
                        title: "Kayıt".i18n()
                    },
                    confirmation: "Silmek istediğinizden emin misiniz?".i18n(),
                    confirmDelete: "Yes"
                }
            });

            refreshTree(null);

            $("#treeMenus").kendoTreeView({
                dragAndDrop: true,
                dataTextField: "name",
                drop: onTreeMenuDrop,
                drag: onTreeMenuDrag

            });

            $("#btnRefreshMenuTree").kendoButton({
                click: refreshTree
            });

            function onTreeMenuDrag(e) {
                // if the current status is "insert-top/middle/bottom"
                if (e.statusClass.indexOf("insert") >= 0) {
                    // deny the operation
                    e.setStatusClass("k-denied");
                    return;
                }
            };

            function refreshTree(e) {
                $.ajax({
                    type: "GET",
                    url: AdminApp.getBackendURL() + "menu/roots",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        var dataSource = new kendo.data.HierarchicalDataSource({
                            data: response,
                            schema: MenuTreeModel
                        });
                        $("#treeMenus").data("kendoTreeView").setDataSource(dataSource);
                        if (e != null) {
                            showToast("success", "Yenileme Başarılı".i18n());
                        }
                    }
                });
            }

            function onTreeMenuDrop(e) {

                if (!e.valid) {
                    return;
                }
                var treeview = $("#treeMenus").data("kendoTreeView");
                var sourceOid = treeview.dataItem(e.sourceNode).oid;
                var destinationOid = sourceOid;
                if (e.dropPosition == "over")
                    destinationOid = treeview.dataItem(e.destinationNode).oid;

                $.ajax({
                    type: "POST",
                    url: AdminApp.getBackendURL() + "menu/movenode/" + sourceOid + "/" + destinationOid,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function () {
                        showToast("success", "Başarıyla Güncellendi".i18n());
                    }
                });

            };
            i18n.translate();
        }
    });

    return MenuManagementView;
});