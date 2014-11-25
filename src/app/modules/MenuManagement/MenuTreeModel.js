define([
    'kendo/kendo.data.min', 'robe/Validations'
], function() {
    var MenuTreeModel = {
        model: {
            id: "oid",
            fields: {
                oid: {
                    editable: false,
                    nullable: true
                },
                lastUpdated: {
                    editable: false,
                    nullable: true
                },
                name: {
                    editable: true,
                    nullable: false
                },
                code: {
                    editable: true,
                    nullable: false
                },
                children: {}
            },
            hasChildren: function(item) {
                return item.items != null;
            }
        }
    };
    return MenuTreeModel;
});