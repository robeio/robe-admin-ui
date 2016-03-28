define([
    'common/SingletonDataSource', './QuartzJobModel'
], function (SingletonDataSource, QuartzJobModel) {
    var QuartzJobDataSource = SingletonDataSource.define({
        name: "QuartzJobDataSource",
        parameters: {
            transport: {
                read: {
                    type: "GET",
                    url: AdminApp.getBackendURL() + "quartzjobs",
                    dataType: "json",
                    contentType: "application/json"
                },
                update: {
                    type: "POST",
                    url: AdminApp.getBackendURL() + "quartzjobs/update",
                    dataType: "json",
                    contentType: "application/json"
                },
                create: {
                    type: "POST",
                    url: AdminApp.getBackendURL() + "quartzjob/fire",
                    dataType: "json",
                    contentType: "application/json"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read") {
                        return kendo.stringify(options);
                    }
                }
            },
            batch: false,
            pageSize: 20,
            schema: {
                model: QuartzJobModel
            }
        }});
    return QuartzJobDataSource;
});
