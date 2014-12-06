define(
  ['jquery', 'backbone', 'models/rootRef', 'views/login', 'views/list'],
  function($, Backbone, RootRef, LoginView, ListView) {
    'use strict';

    var Workspace = Backbone.Router.extend({
      routes: {
        "list": "showList",
        "login": "showLogin",
        "logout": "logout",
        "*path": "defaultRoute"
      },
      initialize: function() {
        this.LoginView = new LoginView({ model: RootRef });
        this.ListView = new ListView({ model: RootRef });
      },
      defaultRoute: function() {
        if (RootRef.firebase.getAuth() === null) {
          window.location.hash = "#/login";
        } else {
          window.location.hash = "#/list";
        }
      },
      showLogin: function() {
        this.ListView.removeTemplate();
        this.LoginView.render();
      },
      showList: function() {
        if (RootRef.firebase.getAuth() === null) {
          window.location.hash = "#/login";
        } else {
          this.LoginView.removeTemplate();
          this.ListView.render();
        }
      },
      logout: function() {
        try {
          RootRef.firebase.unauth();
        } catch(e){}

        window.location.hash = "#/login";
      }
    });

    return Workspace;
  }
)
