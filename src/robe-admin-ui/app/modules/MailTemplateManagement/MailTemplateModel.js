define([
    'kendo/kendo.data.min', 'robe/Validations'
], function() {

    var MailTemplateModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true
            },
            lang: {
                editable: true,
                nullable: false
            },
            code: {
                editable: true,
                nullable: false,
                validation: getValidations("code", "Kod", true, false, 0, 500, "[A-Za-z]+")
            },
            template: {
                editable: true,
                nullable: false
            }
        }
    });
    return MailTemplateModel;
});