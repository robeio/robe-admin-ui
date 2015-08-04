define([
    'kendo/kendo.data.min', 'robe/Validations'
], function () {

    var TriggerModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            name: {
                editable: true,
                nullable: false,
                type: "string",
                hidden: true
            },
            group: {
                editable: true,
                nullable: false,
                type: "string"
            },
            startTime: {
                editable: true,
                nullable: true,
                type: "number",
                defaultValue: -1
            },
            endTime: {
                editable: true,
                nullable: true,
                type: "number",
                defaultValue: -1
            },
            type: {
                editable: true,
                nullable: false,
                type: "string"
            },
            active: {
                editable: true,
                nullable: true,
                type: "boolean"
            },
            jobId: {
                editable: true,
                nullable: false
            },
            repeatCount: {
                editable: true,
                nullable: true,
                type: "number"
            },
            repeatInterval: {
                editable: true,
                nullable: true,
                type: "number"
            }
        }
    });
    return TriggerModel;
});