/*global Backbone, _, $ */
(function (){
	'use strict';

	window.App = {};

	App.Views = {};
	App.Models = {};
	App.Collections = {};

/////////////////////////////MODELS//////////////
////////////////////////////////////////////////

	App.Models.MenuItemModel = Backbone.Model.extend ({
		defaults: {
			name: "",
			description: "...",
			price: 0,
			image: "http://www.302aw.afrc.af.mil/shared/media/document/AFD-090108-058.jpg",
			type: "appetizer"
		},
		firebase: new Backbone.Firebase("https://greenville-thai.firebaseio.com/menu")
	});

	App.Models.SelectedItemModel = Backbone.Model.extend ({
		defaults:{
			total: 0
		}
	});

/////////////////////////////COLLECTIONS/////////
////////////////////////////////////////////////

	App.Collections.AllItems = Backbone.Firebase.Collection.extend ({
		model: App.Models.MenuItemModel,
		firebase: "https://greenville-thai.firebaseio.com/menu"
	});

	App.Collections.SelectedItems = Backbone.Firebase.Collection.extend ({
		model: App.Models.SelectedItemModel,
		firebase: "https://greenville-thai.firebaseio.com/selectedItems"
	});

/////////////////////////////VIEWS///////////////
////////////////////////////////////////////////

	//Menu View to hold all of the menu items from ItemsView
	App.Views.MenuView = Backbone.View.extend ({
		tagName: "ul",
		className: "menu-list",

		initialize: function (options){
			options = options || {};
			this.order = options.order;
			console.log(this.order);
			this.listenTo(this.collection, "sync", this.render);
		},

		render: function(){
			$('.content-wrapper').append(this.el);
			this.collection.each(_.bind(this.renderChild, this));

		},
		renderChild: function(item){
			new App.Views.ItemsView({
				model: item,
				order: this.order
			});
		}
	}); 

	//Items View to render all of the items from the JSON file on Firebase
	App.Views.ItemsView = Backbone.View.extend ({
		tagName: 'li',
		className: 'menu-item',
		template: _.template($("#templates-menu-item").text()),
		
		initialize: function (){
			this.render();
		},

		render: function (){
			$('.menu-list').append(this.el);
			this.$el.html(this.template(this.model.attributes));
		},
	});

//View for producing the total cost
	App.Views.TotalCostView = Backbone.View.extend ({
		tagName: 'li',
		className: 'total',

		events: {
			'click .order': 'addToOrder'
		},

		initialize: function (options){
			options = options || {},
			this.order = options.order;
			console.log('youre the best');
			// $('.total-cost').append(this.el);
			// this.render();
		},

		render: function (){
		},

		
		addToOrder: function (){
			console.log('get it girl');
			console.log(this.model.get('price'));
			// this.model.push(selectedCollection);
		}
	});

	// App.Views.FilteredView = Backbone.View.extend ({
			
	// 	events: {
	// 		'click .apps': 'appView',
	// 		'click .entrees': 'entreeView',
	// 		'click .order-details': 'orderView',
	// 	},

	// 	appView: function (){
	// 		if (this.model.type === 'appetizer'){
	// 			render.this.model;
	// 		}
	// 	},

	// 	initialize: function (){
	// 		console.log(this);

	// 	},


	// });

	// App.Views.OrderDetails = Backbone.View.extend ({

	// });




/////////////////////////////GLUE CODE///////////
////////////////////////////////////////////////
	$(document).ready(function(){
		var allItems = new App.Collections.AllItems();
		var orderCollection = new App.Collections.SelectedItems();
		var order = new App.Models.SelectedItemModel();

		// new App.Views.ItemsView ({
		// 	collection: allItems
		// });

		new App.Views.MenuView({
			collection: allItems,
			order: order
		});

		new App.Views.TotalCostView ({
			order: order,
			collection: orderCollection
		});

		// new App.Views.FilteredView ({});			


	});
})();