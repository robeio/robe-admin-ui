define([
    'kendo/kendo.data.min', 'robe/Validations'
], function() {

    var RoleModel = kendo.data.Model.define({
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
                nullable: false,
                validation: getValidations("name", "Ad", true, false, 2, 50, "[A-Za-z]+")
            },
            code: {
                editable: true,
                nullable: false,
                validation: getValidations("code", "Kod", true, false, 2, 20, "[A-Za-z]+")
            }
        }
    });
    return RoleModel;
});