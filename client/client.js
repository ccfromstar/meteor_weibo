Session.setDefault("currentUrl",{index:true,reg:false});
var urlRouter = Backbone.Router.extend({
	routes:{
		"":"index",
		"reg":"reg"
	},
	index:function(){
		Session.set("currentUrl",{index:true,reg:false});
	},
	reg:function(){
		Session.set("currentUrl",{index:false,reg:true});
	},
	redirect:function(url){
		this.navigate(url,true);
	}
});

Router = new urlRouter;

Meteor.startup(function(){
	Backbone.history.start({pushState:true});
});