define(['common/SingletonDataSource',
    './SystemLanguageModel'
], function(SingletonDataSource, SystemLanguageModel) {
    var SystemLanguageDataSource = SingletonDataSource.define({
        name: "SystemLanguageDataSource",
        parameters: {
            transport: {
                read: {
                    type: "GET",
                    url: AdminApp.getBackendURL() + "languages",
                    dataType: "json",
                    contentType: "application/json"
                }
            },
            batch: false,
            schema: {
                model: SystemLanguageModel
            }
        }
    });
    return SystemLanguageDataSource;
});