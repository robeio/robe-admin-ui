define([
	'common/SingletonDataSource', './MailTemplateModel'
], function(SingletonDataSource, MailTemplateModel) {

	var MailManagementDataSource = SingletonDataSource.define({

		name: "MailManagementDataSource",
		parameters: {
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
				parameterMap: function(options, operation) {
					if (operation !== "read") {
						return kendo.stringify(options);
					}
				}
			},
			batch: false,
			pageSize: 20,
			schema: {
				model: MailTemplateModel
			}
		}
	});
	return MailManagementDataSource;
});