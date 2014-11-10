define([
    'kendo/kendo.data.min', 'robe/Validations'
], function() {

    var TriggerModel = kendo.data.Model.define({
        id: "oid",
        fields: {
            oid: {
                editable: false,
                nullable: false,
                type: "string",
                hidden: true
            },
            jobId: {
                editable: true,
                nullable: true,
                type: "string",
                hidden: true
            },
            cronExpression: {
                editable: true,
                nullable: true,
                type: "string"
            },
            active: {
                editable: true,
                nullable: true,
                type: "boolean"
            },
            fireTime: {
                editable: true,
                nullable: true,
                type: "string"
            }
        }
    });
    return TriggerModel;
});