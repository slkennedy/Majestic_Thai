/*global Backbone, _, $ */
(function (){
	'use strict';

//Models


//Collections

//Views
	var MenuView = Backbone.View.extend ({
		tagName: "ul",
		className: "menu-list",

		render: function(){
			$('.content-wrapper').append(this.el);
			console.log(this);
		}
	}); 

	

//Glue Code
	$(document).ready(function(){
		var menuView = new MenuView();
		menuView.render();




	});
})();