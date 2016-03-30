define([
    'kendo/kendo.data.min', 'robe/Validations'
], function () {

    var MenuModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true
            },
            lastUpdated: {
                editable: true,
                nullable: true
            },
            text: {
                editable: true,
                nullable: false,
                validation: getValidations("text", "Ad", true, false, 2, 50, "[A-Za-z]+")
            },
            module: {
                editable: true,
                nullable: true
            },
            path: {
                editable: true,
                nullable: false,
                validation: getValidations("path", "Yol", true, false, 2, 50, "[A-Za-z]+")
            },
            index: {
                editable: true,
                nullable: false,
                validation: getValidations("index", "Sıra", true, false, null, null, "[0-9]+")
            },
            items: {
                defaultValue: []
            }
        }
    });
    return MenuModel;
});