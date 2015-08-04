define([
    'kendo/kendo.data.min', 'robe/Validations'
], function () {

    var QuartzJobModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: true,
                type: "string",
                hidden: true
            },
            schedulerName: {
                editable: false,
                nullable: true,
                type: "string"
            },
            jobClassName: {
                editable: false,
                nullable: true,
                type: "string"
            },
            description: {
                editable: false,
                nullable: true,
                type: "string"
            }
        }
    });
    return QuartzJobModel;
});