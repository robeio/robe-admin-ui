define([], function() {
	var ProgressBarGroup = new Object();
	ProgressBarGroup.define = function() {
		var me = new Object();

		me.render = function(containerId, title, model, valueKey, multiplier, max) {
			if (!max) {
				max = 0;
				for (var i = 0; i < model.length; i++) {
					max += (model[++i][valueKey]) / multiplier;
				};
			}
			var header = "<div class='panel panel-default'><div class='panel-heading'><div class='panel-title'>" + title + "</div>" + max.toFixed(0) + " total </div><table class='panel-body' style='border-collapse:separate;'>";
			for (var i = 0; i < model.length; i++) {
                try {
                    header += this.createMeterRow(max.toFixed(0), ((model[i + 1][valueKey]) / multiplier).toFixed(0), model[i++]);
                }catch (e){
                    header += this.createMeterRow(max.toFixed(0), 0, model[i++]);
                }
			};

			header += "</table></div>";
			$('#' + containerId).html(header);

		};
		me.createMeterRow = function(max, value, label) {
			var percent = ((value / max) * 100).toFixed(0);
			var html = "<tr> <td class='text-right' style='padding-right:5px;'>" + label + ":   </td><div><td style='width:100%;' class='progress'><div class='progress-bar' role='progressbar' aria-valuenow='" + percent + "' aria-valuemin='0' aria-valuemax='100' style='width: " + percent + "%;'></div></td><td style='padding-left:5px;'>" + value + "</td></tr>";
			return html;
		}
		return me;
	};

	return ProgressBarGroup;
});