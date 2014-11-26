define(['common/SingletonDataSource', './RoleModel'], function(SingletonDataSource, RoleModel) {
	var GroupedRoleDataSource = SingletonDataSource.define({
		name: "GroupedRoleDataSource",
		parameters: {
			data: [],
			schema: {
				model: RoleModel
			}
		}
	});
	return GroupedRoleDataSource;
});