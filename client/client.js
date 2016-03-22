Session.setDefault("currentUrl",{index:"active",reg:"",login:""});
Session.setDefault("info",{success:"",error:""});
var urlRouter = Backbone.Router.extend({
	routes:{
		"":"index",
		"reg":"reg",
		"logout":"logout",
		"login":"login"
	},
	index:function(){
		Session.set("currentUrl",{index:"active",reg:"",login:""});
	},
	reg:function(){
		Session.set("currentUrl",{index:"",reg:"active",login:""});
	},
	logout:function(){
		if(Meteor.userId()){
			Meteor.logout();
			this.navigate("/",true);
			Session.set("info",{success:"退出成功",error:""});
		}else{
			this.navigate("/",true);
			Session.set("info",{success:"",error:"用户不在线"});
		}
	},
	login:function(){
		if(Meteor.userId()){
			this.navigate("/",true);
			Session.set("info",{success:"",error:"用户已在线"});
		}
		Session.set("currentUrl",{index:"",reg:"",login:"active"});
	},
	redirect:function(url){
		this.navigate(url,true);
	}
});

Router = new urlRouter;

Template.container.helpers({
    currentUrl: function () {
        return Session.get('currentUrl');
    }
});

Template.reg.events({
	'click #submit': function(e){
		e.preventDefault();
		if(!$("#username").val()){
			Session.set("info",{success:"",error:"用户名必填"});
			return;
		}
		if(!$("#password").val()){
			Session.set("info",{success:"",error:"密码必填"});
			return;
		}
		Accounts.createUser({
			username:$("#username").val(),
			password:$("#password").val()
		},function(err){
			if(err){
				Session.set("info",{success:"",error:err.reason});
			}else{
				Session.set("info",{success:"注册成功",error:""});
				Router.redirect("/");
			}
		});
	}
});

Template.login.events({
	'click #submit': function(e){
		e.preventDefault();
		if(!$("#username").val()){
			Session.set("info",{success:"",error:"用户名必填"});
			return;
		}
		if(!$("#password").val()){
			Session.set("info",{success:"",error:"密码必填"});
			return;
		}
		Meteor.loginWithPassword($("#username").val(),$("#password").val(),function(err){
			if(err){
				Session.set("info",{success:"",error:err.reason});
			}else{
				Session.set("info",{success:"登陆成功",error:""});
				Router.redirect("/");
			}
		});
	}
});

Posts = new Meteor.Collection("posts");

Template.index.events({
	'click #submit': function(e){
		e.preventDefault();
		var $post = $("#post").val();
		Posts.insert({
			user:Meteor.user(),
			post:$post,
			time:new Date()
		},function(err){
			if(err){
				Session.set("info",{success:"",error:err.reason});
			}else{
				Session.set("info",{success:"发表成功",error:""});
				$("#post").val("");
			}
		});
	}
});

Template.index.posts = function(){
	return Posts.find({},{sort:{time:-1}});
}

Template.info.info = function(){
	return Session.get("info");
}

Meteor.startup(function(){
	Backbone.history.start({pushState:true});
});