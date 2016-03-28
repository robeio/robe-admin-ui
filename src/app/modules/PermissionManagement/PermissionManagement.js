var checkAllFlag = true;

define([
    'text!./PermissionManagement.html',
    './ServiceDataSource',
    '../RoleManagement/RoleDataSource',
    '../MenuManagement/MenuTreeModel',
    'kendo/kendo.splitter.min',
    'kendo/kendo.window.min',
    'kendo/kendo.grid.min',
    'kendo/kendo.dropdownlist.min',
    'kendo/kendo.treeview.min',
    'robe/view/RobeView'
], function (view, ServiceDataSource, RoleDataSource, MenuTreeModel) {

    var PermissionManagement = require('robe/view/RobeView').define({
        name: "PermissionManagement",
        html: view,
        containerId: "container",

        initialize: function () {

            i18n.init("PermissionManagement");
            var me = this;

            $("#gridServices").kendoGrid({
                dataSource: ServiceDataSource.get(),
                selectable: false,
                columns: [{
                    template: '<input type="checkbox" class="checkRow"/>',
                    headerTemplate: '<input type="checkbox" id="checkAll"/>',
                    field: "selected",
                    title: "&nbsp;",
                    width: 8
                }, {
                    field: "method",
                    title: "Metod".i18n(),
                    width: 20
                }, {
                    field: "path",
                    title: "Servis".i18n(),
                    width: 90,
                    headerTemplate: "<span lang='tr'>Servis</span><button class=\"pull-right\" id=\"btnRefreshServices\"><span class=\"k-icon k-si-refresh\"/></button>"
                }]
            });


            $("#checkAll").click(function () {
                if (checkAllFlag) {
                    for (var i = 0; i < $(".checkRow").length; i++) {
                        var row = $(".checkRow")[i];
                        row.setAttribute("checked", true);
                        row.parentElement.parentElement.setAttribute("class", "r-state-selected");
                    }
                    checkAllFlag = false;
                } else {
                    for (var i = 0; i < $(".checkRow").length; i++) {
                        var row = $(".checkRow")[i];
                        row.removeAttribute("checked");
                        row.parentElement.parentElement.removeAttribute("class", "r-state-selected");
                    }
                    checkAllFlag = true;
                }
            });

            $("#cmbRoles").kendoDropDownList({
                dataTextField: "name",
                dataValueField: "oid",
                dataSource: RoleDataSource.get(),
                change: function () {
                    var roleOid = $("#cmbRoles").val();
                    if (!roleOid && roleOid == ""){
                        var tree = $("#treeMenus").data("kendoTreeView");
                        checkByNodeIds(tree.dataSource.data(), []);
                        checkRows([]);
                        return;
                    }
                    $.ajax({
                        type: "GET",
                        url: AdminApp.getBackendURL() + "permissions/" + roleOid + "/menu",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            var tree = $("#treeMenus").data("kendoTreeView");
                            tree.expand(".k-item");
                            checkByNodeIds(tree.dataSource.data(), response);
                        }
                    });
                    $.ajax({
                        type: "GET",
                        url: AdminApp.getBackendURL() + "permissions/" + roleOid + "/service",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            checkRows(response);
                        }
                    });
                },
                autoBind: false,
                optionLabel: "Seçiniz...".i18n(),
                index: -1
            });

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
                    var tree = $("#treeMenus").data("kendoTreeView");
                    tree.setDataSource(dataSource);
                    tree.expand(".k-item");
                }
            });

            $("#treeMenus").kendoTreeView({
                checkboxes: {
                    checkChildren: true
                },
                loadOnDemand: false,
                select: function (e) {
                    e.preventDefault();
                    $(e.node).find(':checkbox').click();
                },
                dataTextField: "name"
            });

            $("#btnRefreshServices").kendoButton({
                click: function () {
                    $.ajax({
                        type: "GET",
                        url: AdminApp.getBackendURL() + "service/refresh",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            showToast("success", "Başarılı. Bulunan Yeni Servis Sayısı :".i18n() + response);
                            ServiceDataSource.parameters.transport.read.complete=  function (){
                                $("#cmbRoles").data("kendoDropDownList").trigger("change");
                            }
                            ServiceDataSource.read(true);
                        }
                    });
                }
            });

            $("#btnSavePermission").kendoButton({
                click: function () {
                    var roleOid = $("#cmbRoles").val();
                    var checkedNodes = [];
                    var treeMenus = $("#treeMenus").data("kendoTreeView");

                    checkedNodeIds(me, treeMenus.dataSource.view(), checkedNodes);
                    $.ajax({
                        type: "PUT",
                        url: AdminApp.getBackendURL() + "permission/" + roleOid + "/menu",
                        dataType: "json",
                        data: kendo.stringify(checkedNodes),
                        contentType: "application/json; charset=utf-8",
                        success: function () {
                            showToast("success", "Başarılı")
                        }
                    });


                    $.ajax({
                        type: "PUT",
                        url: AdminApp.getBackendURL() + "permission/" + roleOid + "/service",
                        dataType: "json",
                        data: kendo.stringify(getCheckedRows()),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                        }
                    });
                }
            });


            // function that gathers IDs of checked nodes
            function checkedNodeIds(me, nodes, checkedNodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].checked) {
                        checkedNodes.push(nodes[i].id);
                    }

                    if (nodes[i].hasChildren) {
                        checkedNodeIds(me, nodes[i].children.view(), checkedNodes);
                    }
                }
            };

            // function that gathers IDs of checked nodes
            function checkByNodeIds(nodes, targetNodes) {
                var tree = $("#treeMenus").data("kendoTreeView");
                var nodeUid;
                var nodeOid;
                for (var i = 0; i < nodes.length; i++) {
                    nodeUid = nodes[i].uid;
                    nodeOid = nodes[i].id;
                    var isChecked = $.inArray(nodes[i].id, targetNodes) != -1;
                    tree.findByUid(nodeUid).find("input[type=checkbox]").prop("checked", isChecked);
                    nodes[i].set("checked", isChecked);
                    if (nodes[i].hasChildren) {
                        checkByNodeIds(nodes[i].children.data(), targetNodes);
                    }
                }
            };


            //on dataBound event restore previous selected rows:
            function checkRows(checkedServiceOids) {
                var grid = $("#gridServices").data("kendoGrid");
                var gridTbody = grid.tbody;
                var view = grid.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    var row = gridTbody.find("tr[data-uid='" + view[i].uid + "']");
                    if (checkedServiceOids.indexOf(view[i].id) >= 0) {
                        row.find("input[type=checkbox]").prop("checked", true);
                        row.addClass("r-state-selected");
                    } else {
                        row.find("input[type=checkbox]").prop("checked", false);
                        row.removeClass("r-state-selected");
                    }
                }
            };

            function getCheckedRows() {
                var grid = $("#gridServices").data("kendoGrid");
                var sel = $("input:checked", grid.tbody).closest("tr");
                var items = [];
                $.each(sel, function (idx, row) {
                    var item = grid.dataItem(row);
                    items.push(item.get("oid"));

                });
                return items;
            }

            i18n.translate();
        }
    });

    return PermissionManagement;
});