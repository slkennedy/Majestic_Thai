/*global Backbone, _, $ */
(function (){
	'use strict',

//Models
var Foods = Backbone.Model.extend ({
	defaults: {
		name: "",
		price: 10,
		description: "..."
	}
});

//Collections

//Views
	var MenuView = Backbone.View.extend ({
		tagName: "ul",
		className: "menu-list",

		initialize: function (options){
			options = options || {};
			this.$container = options.$container;
			this.$container.append(this.el);
		},

		render: function(){

		}
	}); 


//Glue Code
	$(document).ready(function(){
		var food = [
		{name: "name", price: 12, description: "This is some food and here is the description", type: "app"}
		{name: "otherName", price: 20, description: "This is some other food and here is the other food's description", type: "entree"}
		];

		var eats = new MenuView;



	});
})();