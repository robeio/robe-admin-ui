define([], function() {
	var Grid = new Object();
	Grid.define = function() {
		var me = new Object();

		me.render = function(containerId, title,metricList, model,valueKey,scale) {
			var header = "<div class='panel panel-default'><div class='panel-heading'><div class='panel-title'>" + title + "</div>"+model.count+" total</div><div class='panel-body container '>";
			scale = ((scale === undefined) ? 4 : scale );
			for(var i = 0 ; i < metricList.length ; i++){
				if(valueKey){
					header += this.createMeterRow(metricList[i++],model[metricList[i]][valueKey].toFixed(scale));
				}else{
					header += this.createMeterRow(metricList[i++],model[metricList[i]].toFixed(scale));
				}
			}

			header += "</div></div>";
			$('#' + containerId).html(header);

		};
		me.createMeterRow = function(label,value) {

			return "<div class='row '> <div class='col-md-1 column text-right'>" + label + ":</div><div class='col-md-1 column'>" + value + "</div> </div>";
		}
		return me;
	};

	return Grid;
});