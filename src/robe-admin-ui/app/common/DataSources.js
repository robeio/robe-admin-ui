GroupedRoleDataSource, UnGroupedRoleDataSource, MenuDataSource, ServiceDataSource, MailManagementDataSource, SystemLanguageDatasource, QuartzJobDataSource, TriggerDataSource;
define([
    'js/data/SingletonDataSource', 'js/Models'], function (S, HDS) {

    MailManagementDataSource = new SingletonDataSource("MailManagementDataSource", {
        transport: {
            read: {
                type: "GET",
                url: AdminApp.getBackendURL() + "mailtemplate/all",
                dataType: "json",
                contentType: "application/json"
            },
            create: {
                type: "PUT",
                url: AdminApp.getBackendURL() + "mailtemplate",
                dataType: "json",
                contentType: "application/json"
            },
            update: {
                type: "POST",
                url: AdminApp.getBackendURL() + "mailtemplate",
                dataType: "json",
                contentType: "application/json"
            },
            destroy: {
                type: "DELETE",
                url: AdminApp.getBackendURL() + "mailtemplate",
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
            model: MailManagementModel
        }
    });

    SystemLanguageDatasource = new SingletonDataSource("SystemLanguageDatasource", {
        transport: {
            read: {
                type: "GET",
                url: AdminApp.getBackendURL() + "language/all",
                dataType: "json",
                contentType: "application/json"
            }
        },
        batch: false,
        schema: {
            model: SystemLanguageModel
        }
    });

    QuartzJobDataSource = new SingletonDataSource("QuartzJobDataSource", {
        transport: {
            read: {
                type: "GET",
                url: AdminApp.getBackendURL() + "quartzJob",
                dataType: "json",
                contentType: "application/json"
            },
            update: {
                type: "POST",
                url: AdminApp.getBackendURL() + "quartzJob/update",
                dataType: "json",
                contentType: "application/json"
            },
            create: {
                type: "POST",
                url: AdminApp.getBackendURL() + "quartzJob/fire",
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
    });
});


