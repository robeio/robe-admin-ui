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
                dataSource: MenuDataSource.get(true),
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
                    field: "index",
                    title: "Sıra".i18n(),
                    width: "30px"
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


            MenuDataSource.parameters.transport.update.complete = function (data, status) {
                refreshTree(null);
            };
            MenuDataSource.parameters.transport.create.complete = function (data, status) {
                refreshTree(null);
            };
            MenuDataSource.parameters.transport.destroy.complete = function (data, status) {
                refreshTree(null);
            };

            refreshTree(null);

            var treeView = $("#treeMenus").kendoTreeView({
                dragAndDrop: true,
                dataTextField: "name",
                drop: onTreeMenuDrop
            }).data("kendoTreeView");

            $("#btnRefreshMenuTree").kendoButton({
                click: refreshTree
            });


            function refreshTree(e) {
                $.ajax({
                    type: "GET",
                    url: AdminApp.getBackendURL() + "menus/roots",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        var dataSource = new kendo.data.HierarchicalDataSource({
                            data: response,
                            schema: MenuTreeModel
                        });
                        treeView.setDataSource(dataSource);
                        if (e != null) {
                            showToast("success", "Yenileme Başarılı".i18n());
                        }

                        expandNextLevel();
                    }
                });
            }

            function expandNextLevel() {
                setTimeout(function () {
                    var b = $('.k-item .k-plus').length;
                    treeView.expand(".k-item");
                    treeView.trigger('dataBound');
                    if (b > 0) {
                        expandNextLevel();
                    }

                });
            }

            function onTreeMenuDrop(e) {

                if (!e.valid) {
                    return;
                }
                var sourceItem = treeView.dataItem(e.sourceNode);
                //over, before, or after.
                var destinationItem = treeView.dataItem(e.destinationNode);

                if (e.dropPosition == "over") {

                    $.ajax({
                        type: "POST",
                        url: AdminApp.getBackendURL() + "menus/movenode/" + sourceItem.oid + "/" + destinationItem.oid,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function () {
                            showToast("success", "Başarıyla Güncellendi".i18n());
                        }
                    });
                } else {
                    var order = destinationItem.index;
                    if (e.dropPosition == "before") {
                        order--;
                    } else {
                        order++;
                    }
                    sourceItem.parentOid = destinationItem.parentOid;
                    sourceItem.index = order;
                    delete sourceItem.expanded;
                    $.ajax({
                        type: "PUT",
                        url: AdminApp.getBackendURL() + "menus/" + sourceItem.oid,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: kendo.stringify(sourceItem),
                        success: function () {
                            showToast("success", "Başarıyla Güncellendi".i18n());
                            MenuDataSource.get(true);

                            expandNextLevel();
                        }
                    });


                }

            };
            i18n.translate();
        }
    });

    return MenuManagementView;
});