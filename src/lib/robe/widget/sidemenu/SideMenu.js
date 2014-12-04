define([    
	'text!./SideMenu.html',
	'text!./SideMenuItem.html',
	'text!./SideMenuSubItem.html',

	'robe/view/RobeView'
	], function(view,itemView,subItemView) {

		var SideMenu = require('robe/view/RobeView').define({
			name:"SideMenu",
			html:view,
			containerId: "sidebar-left",
			items:null,
			initialize: function () {
				var container = $('#' + this.containerId);
				
				var renderedItems = container.find('#items');
				renderedItems.html("");

				for(var i = 0 ; i < this.items.length; i++ ){
					var item = this.items[i];
					var renderedItem = $(itemView);
					var icon = renderedItem.find('#itemIcon');
					icon.attr("class" , icon.attr("class") + item.cssClass);

					renderedItem.click(function(e){
						var item = $(e.target).parent('#itemCommand').parent().find('#itemSubItems');
						if(item.length == 0){
							item = $(e.target).parent().find('#itemSubItems');
						}
						item.fadeToggle(200)
					});
					var renderedSubItems = renderedItem.find('#itemSubItems');
					renderedItem.find('#itemName').html(item.text);
					var subItems = item['items'];
					for(var j = 0 ; j < subItems.length; j++ ){
						var renderedSubItem = $(subItemView);
						renderedSubItem.find('#itemRef').attr("href" , "#/"+subItems[j].cssClass);
						var name = renderedSubItem.find('#itemName');
						var icon = renderedSubItem.find('#itemIcon');

						name.html(subItems[j].text);
						renderedSubItem.click(function(e){
							if(e.target.tagName == 'I' || e.target.tagName == 'i'){
								$('#lblContainerTitle').text($(e.target).siblings('span').text());

							} else {
        						$('#lblContainerTitle').text($(e.target).text());
        					}
						});
						icon.attr("class" , icon.attr("class") + subItems[j].cssClass);
						renderedSubItems.append(renderedSubItem);

					}
					renderedItems.append(renderedItem);
				}

			}
		});

		return SideMenu;
	});