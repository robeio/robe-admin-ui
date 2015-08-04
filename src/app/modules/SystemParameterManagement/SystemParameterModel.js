define([
    'kendo/kendo.data.min'
], function () {
    var SystemParameterModel = kendo.data.Model.define({
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
                type: "number",
                defaultValue: 0
            },
            key: {
                editable: true,
                nullable: false,
                type: "string",
                validation: {
                    required: {
                        message: "Zorunludur"
                    }
                }
            },
            value: {
                editable: true,
                nullable: true,
                type: "string"
            }
        }
    });

    return SystemParameterModel;
});