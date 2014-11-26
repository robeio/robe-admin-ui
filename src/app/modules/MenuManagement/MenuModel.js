define([
    'kendo/kendo.data.min', 'robe/Validations'
], function() {

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
            name: {
                editable: true,
                nullable: false,
                validation: getValidations("name", "Ad", true, false, 2, 50, "[A-Za-z]+")
            },
            code: {
                editable: true,
                nullable: false,
                validation: getValidations("code", "Kod", true, false, 2, 50, "[A-Za-z]+")
            }
        }
    });
    return MenuModel;
});