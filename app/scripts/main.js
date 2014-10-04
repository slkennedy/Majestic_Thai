/*global Backbone, _, $ */
(function (){
	'use strict';

	window.App = {};

	App.Views = {};
	App.Models = {};
	App.Collections = {};

/////////////////////////////MODELS//////////////
////////////////////////////////////////////////

	App.Models.MenuItem = Backbone.Model.extend ({
		defaults: {
			name: "",
			description: "...",
			price: 0,
			image: "http://www.302aw.afrc.af.mil/shared/media/document/AFD-090108-058.jpg",
			type: "appetizer"
		},
		firebase: new Backbone.Firebase("https://greenville-thai.firebaseio.com/")
	});

/////////////////////////////COLLECTIONS/////////
////////////////////////////////////////////////

	App.Collections.AllItems = Backbone.Collection.extend ({
		model: App.Models.MenuItem,
		firebase: "https://greenville-thai.firebaseio.com/"
	});

/////////////////////////////VIEWS///////////////
////////////////////////////////////////////////

	//Items View to render all of the items from the JSON file on Firebase
	App.Views.ItemsView = Backbone.View.extend ({
		tagName: 'li',
		className: 'menu-item',
		template: _.template($("#templates-menu-item").text()),

		initialize: function (){
			console.log("this is: "+this);
			this.collection.each(function(item){
				console.log("this is each of the collection"+item);
			})
		},

		render: function (){
			this.$el.html(this.template(this.model));
			$('.menu-list').append(this.el);
		},
	});

	//Menu View to hold all of the menu items from ItemsView
	App.Views.MenuView = Backbone.View.extend ({
		tagName: "ul",
		className: "menu-list",

		initialize: function (){
			this.render();
			// var items = new App.Views.ItemsView;
			// items.render();
		},

		render: function(){
			$('.content-wrapper').append(this.el);
		}
	}); 

/////////////////////////////GLUE CODE///////////
////////////////////////////////////////////////
	$(document).ready(function(){
		var allItems = new App.Collections.AllItems();

		new App.Views.ItemsView ({
			collection: allItems
		});

		new App.Views.MenuView({
			collection: allItems
		});

	});
})();