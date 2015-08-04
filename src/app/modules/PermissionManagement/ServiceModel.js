define([
    'kendo/kendo.data.min', 'robe/Validations'
], function () {
    var ServiceModel = kendo.data.Model.define({
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
            path: {
                editable: true,
                nullable: true,
                validation: getValidations("code", "Kod", true, false, 1, 100)
            },
            method: {
                editable: true,
                nullable: false,
                validation: getValidations("code", "Kod", true, false, 1, 10, "[A-Z]+")
            }
        }
    });
    return ServiceModel;
});