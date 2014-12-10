define(
  ['jquery', 'backbone',
    'models/rootRef',
    'collections/bracelets',
    'views/login', 'views/list', 'views/menu'
  ],
  function($, Backbone, RootRef, Bracelets, LoginView, ListView, MenuView) {
    //TODO: this router is doing too much.
    //  Bracelets, ListView and MenuView shouldn't be loaded unless we're authenticated with firebase.
    //  Perhaps make login it's own app? Or give login it's own router?
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
        this.ListView = new ListView({ collection: Bracelets });
        this.MenuView = new MenuView({ model: RootRef });
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
        this.MenuView.removeTemplate();
        this.LoginView.render();
      },
      showList: function() {
        if (RootRef.firebase.getAuth() === null) {
          window.location.hash = "#/login";
        } else {
          this.LoginView.removeTemplate();
          this.MenuView.render();
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
