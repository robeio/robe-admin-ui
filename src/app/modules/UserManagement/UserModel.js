define([
    'kendo/kendo.data.min', 'robe/Validations'
], function () {

    var UserModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true,
                type: "string"
            },
            lastUpdated: {
                editable: true,
                nullable: true,
                type: "string"
            },
            name: {
                editable: true,
                nullable: false,
                type: "string",
                validation: getValidations("name", "Ad", true, false, 2, 50, "[A-Za-z]+")
            },
            surname: {
                editable: true,
                nullable: false,
                type: "string",
                validation: getValidations("surname", "Soyad", true, false, 2, 50, "[A-Za-z]+")
            },
            email: {
                editable: true,
                nullable: false,
                type: "string",
                validation: getValidations("email", "Eposta", true, true, 5, 50)
            },
            active: {
                type: "boolean"
            },
            roleOid: {
                editable: true,
                nullable: false
            },
            role: {}
        }
    });
    return UserModel;
});