function removeItem(e, id) {
    var GroupedRoleDataSource = removeItem.prototype.GroupedRoleDataSource;
    var UnGroupedRoleDataSource = removeItem.prototype.UnGroupedRoleDataSource;
    var selectedGroup = removeItem.prototype.selectedGroup;
    var item = removeItem.prototype.GroupedRoleDataSource.get(false).getByUid(id);

    $.ajax({
        type: "DELETE",
        url: AdminApp.getBackendURL() + "role/destroyRoleGroup/" + selectedGroup + "/" + item.oid,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            UnGroupedRoleDataSource.get(false).add(item);
            GroupedRoleDataSource.get(false).remove(item);
            $(e).parent().remove();
        },
        error: function(e) {
            $.pnotify({
                text: "Bir hata oluştu",
                type: 'error'
            });
        }
    });
}
define([
    'text!./RoleManagement.html',
    './RoleDataSource',
    './GroupedRoleDataSource',
    './UnGroupedRoleDataSource',
    'kendo/kendo.grid.min',
    'kendo/kendo.window.min',
    'kendo/kendo.listview.min',
    'kendo/kendo.tabstrip.min',
    'robe/view/RobeView'
], function(view, RoleDataSource,GroupedRoleDataSource,UnGroupedRoleDataSource) {

    var RoleManagementView = require('robe/view/RobeView').define({
        name: "RoleManagementView",
        html: view,
        containerId: "container",

        initialize: function() {

            $("#gridRoles").kendoGrid({
                dataSource: RoleDataSource.get(),
                sortable: true,
                pageable: {
                    refresh: true
                },
                toolbar: [{
                    name: "create",
                    text: "Yeni Rol"
                }],
                columns: [{
                    field: "name",
                    title: "Ad"
                }, {
                    field: "code",
                    title: "Kod"
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

            $("#listAllRoles").kendoListView({
                dataSource: RoleDataSource.get(false),
                template: "<div class='tags k-block'>#:name#</div>",
                selectable: "single",
                change: onListChange,
                autoBind: false
            });

            $("#listGroupedRoles").kendoListView({
                dataSource: GroupedRoleDataSource.get(),
                template: "<div class='tags move  k-block'>#:name#</div><a href='javascript:' class='tagitemcls' onclick=\"removeItem(this,'#:uid#')\"><span class='k-icon k-i-close'></span></a>"
            });
            removeItem.prototype.GroupedRoleDataSource = GroupedRoleDataSource;
            removeItem.prototype.UnGroupedRoleDataSource = UnGroupedRoleDataSource;

            $("#listUnGroupedRoles").kendoListView({
                dataSource: UnGroupedRoleDataSource.get(),
                template: "<div class='tags move k-block'>#:name#</div>"
            });

            $("#listUnGroupedRoles").kendoDraggable({
                filter: ".move",
                hint: function(element) {
                    return element.clone();
                }
            });

            $("#listGroupedRoles").kendoDropTarget({
                dragenter: function(e) {
                    e.draggable.hint.css("opacity", 0.6);
                },
                dragleave: function(e) {
                    e.draggable.hint.css("opacity", 1);
                },
                drop: function(e) {

                    var data = RoleDataSource.get(false).view();
                    var groupOid = removeItem.prototype.selectedGroup;

                    var item = UnGroupedRoleDataSource.get(false).getByUid(e.draggable.hint.data().uid);
                    if (groupOid === item.oid) {
                        return;
                    } else {
                        $.ajax({
                            type: "PUT",
                            url: AdminApp.getBackendURL() + "role/group/" + groupOid + "/" + item.oid,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            success: function() {
                                GroupedRoleDataSource.get(false).add(item);
                                UnGroupedRoleDataSource.get(false).remove(item);
                            }
                        });
                    }
                }
            });

            function onListChange(e) {

                var data = RoleDataSource.get(false).view(),
                    selected = $.map(this.select(), function(item) {
                        removeItem.prototype.selectedGroup = data[$(item).index()].oid;
                        return removeItem.prototype.selectedGroup;
                    });

                $.ajax({
                    type: "GET",
                    url: AdminApp.getBackendURL() + "role/" + selected,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function(response) {
                        GroupedRoleDataSource.get().data(response.roles);
                        var oids = [];
                        for (var i = 0; i < response.roles.length; i++) {
                            oids.push(response.roles[i].oid);
                        }
                        oids.push(removeItem.prototype.selectedGroup);
                        var unGrouped = RoleDataSource.get(false).data().filter(function(elem) {
                            return oids.indexOf(elem.oid) === -1;
                        });
                        UnGroupedRoleDataSource.get().data(unGrouped);
                    }
                });
            };

            $("#tabstrip").kendoTabStrip();
        }
    });
    return RoleManagementView;
});