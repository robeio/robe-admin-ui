define([
    'common/SingletonDataSource', './ServiceModel'
], function(SingletonDataSource, ServiceModel) {
    var RoleDataSource = SingletonDataSource.define({
    	name:"ServiceDataSource", 
    	parameters: {
        transport: {
            read: {
                type: "GET",
                url: AdminApp.getBackendURL() + "service/all",
                dataType: "json",
                contentType: "application/json"
            }
        },
        batch: false,
        schema: {
            model: ServiceModel
        }
    }});
    return RoleDataSource;
});