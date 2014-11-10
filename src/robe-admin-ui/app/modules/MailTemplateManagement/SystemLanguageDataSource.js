define(['common/SingletonDataSource',
    './SystemLanguageModel'
], function(SingletonDataSource, SystemLanguageModel) {
    var SystemLanguageDatasource = SingletonDataSource.define({
        name: "SystemLanguageDatasource",
        parameters: {
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
        }
    });
    return SystemLanguageDatasource;
});