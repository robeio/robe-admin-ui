define([], function() {
	var Class = function() {};
	Class.define = function(parameters) {
		var me = new Class();
		for (var parameter in this) {
			me[parameter] = this[parameter];
		}
		for (var parameter in parameters) {
			me[parameter] = parameters[parameter];
		}
		return me;
	};
	return Class;
});