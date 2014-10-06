/*global Backbone, _, $ */
(function (){
	'use strict';

	window.App = {};

	App.Views = {};
	App.Models = {};
	App.Collections = {};

/////////////////////////////MODELS//////////////
////////////////////////////////////////////////

	//Model for all menu items
	//connected to JSON file on Firebase
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

	//Model for items that are selected with a button click
	//Empty array is for selected names to be pushed into
	App.Models.SelectedItemModel = Backbone.Model.extend ({
		defaults:{
			total: 0,
			name: []
		}
	});

/////////////////////////////COLLECTIONS/////////
////////////////////////////////////////////////

	//Collection for all menu items
	//Connected to existing JSON data on Firebase
	App.Collections.AllItems = Backbone.Firebase.Collection.extend ({
		model: App.Models.MenuItemModel,
		firebase: "https://greenville-thai.firebaseio.com/menu"
	});

	//Collection for selected menu items
	//connected to firebase to push orders back to the server
	App.Collections.SelectedItems = Backbone.Firebase.Collection.extend ({
		model: App.Models.SelectedItemModel,
		firebase: "https://greenville-thai.firebaseio.com/selectedItems"
	});

/////////////////////////////VIEWS///////////////
////////////////////////////////////////////////

	//Menu View to hold all of the menu items from ItemsView
	//Models: MenuItemModel (set in App.Collections.AllItems) 
	//Models: SelectedItems (set to equal order in the glue code)
	//Collections: AllItems
	App.Views.MenuView = Backbone.View.extend ({
		tagName: "ul",
		className: "menu-list",

		//on initalize - 
		//data passed in will be set to itself or an empty object
		//order equals the model of selectedItems
		//the object of this will be set to equal options 
		//this view will listen for collection AllItems to sync & then run render function
		initialize: function (options){
			options = options || {};
			this.order = options.order;
			this.listenTo(this.collection, "sync", this.render);
		},

		//on render -
		//DOM container w/class of content-wrapper will be appended w/a ul w/class...
		//of menu-list the AllItems collection will be eached over and each model...
		//in the collection will have the renderChild function attached to it
		//then renderChild will run
		render: function(){
			$('.content-wrapper').append(this.el);
			this.collection.each(_.bind(this.renderChild, this));
		},

		//on renderChild -
		//a new instance of the ItemsView will be create for Each model found in AllItems
		//these instances will be passed to the ItemsView
		renderChild: function(item){
			new App.Views.ItemsView({
				model: item,
				order: this.order
			});
		}
	}); 

	//Items View to render all of the items from the JSON file on Firebase into the DOM
	//Models: MenuItemModel (set in App.Collections.AllItems) 
	//Models: SelectedItems (set to equal order in the glue code)
	//Collections: AllItems
	App.Views.ItemsView = Backbone.View.extend ({
		tagName: 'li',
		className: 'menu-item',
		template: _.template($("#templates-menu-item").text()),

		//on event - 
		//when the button w/class of order is clicked the function changeOrder will run
		events: {
			'click .order': 'changeOrder'
		},

		//on initialize - 
		//
		initialize: function (options){
			options = options || {};
			this.order = options.order;
			this.render();
		},

		//on render -
		//DOM container w/class of menu-list will be appended with li's w/a class...
		//of menu-item 
		//the li's will have html added to them
		//the added html will be the template (declared above) and... 
		//the model's attributes passed down from MenuView
		render: function (){
			$('.menu-list').append(this.el);
			this.$el.html(this.template(this.model.attributes));
		},

		//on changeOrder - 
		//the total attribute of SelectedItemModel will be set to equal the...
		//price of MenuItemModel plus the existing total from SelectedItemModel
		//the name from MenuItemModel will be pushed to the SelectedItemModel's ...
		//name attribute for display later
		changeOrder: function (){
			this.order.set('total', this.model.get('price')+this.order.get('total'));
			this.order.get('name').push(this.model.get('name'));
			console.log(this.order.get('name'));
		}
	});

//View for producing the total cost
	//Models: MenuItemModel (set in App.Collections.AllItems) 
	//Models: SelectedItems (set to equal order in the glue code)
	//Collections:
	App.Views.TotalCostView = Backbone.View.extend ({
		
		//on initalize - 
		//SelectedItemsModel is set to equal options
		//the view object is set to listen to SelectedItemsModel for a change...
		//change is the addition of the MenuItemModel price to the SelectedItemModel total
		//when change occurs the function of addToOrder will run on the SelectedItemModel
		initialize: function (options){
			options = options || {},
			this.order = options.order;
			this.listenTo(this.order, 'change', this.addToOrder);
		},

		render: function (){
		},
		
		//on addToOrder - 
		//DOM container w/class of amount has a dollar sign and the new total attribute ...
		//from SelectedItemModel added to it
		//Dom container w/class of names will have the name attribute from... 
		//SelectedItemModel added to it
		addToOrder: function (){
			$('.amount').html(' $ '+this.order.get('total'));
			$('.names').html(this.order.get('name'));
		}
	});

	//Here I want to filter my menu by type of food (appetizer vs. entree)
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

/////////////////////////////GLUE CODE///////////
////////////////////////////////////////////////
	$(document).ready(function(){
		var allItems = new App.Collections.AllItems();
		var orderCollection = new App.Collections.SelectedItems();
		var order = new App.Models.SelectedItemModel();

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