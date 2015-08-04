define(['common/SingletonDataSource', './RoleModel'], function(SingletonDataSource, RoleModel) {
	var UnGroupedRoleDataSource = SingletonDataSource.define({
		name: "UnGroupedRoleDataSource",
		parameters: {
			data: [],
			schema: {
				model: RoleModel
			}
		}
	});
	return UnGroupedRoleDataSource;
});