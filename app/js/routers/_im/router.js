define(
  ['jquery', 'backbone',
  'models/rootRef',
  'collections/bracelets',
  'views/_im/login', 'views/_im/list', 'views/_im/menu', 'views/_im/bracelet'
  ],
  function($, Backbone, RootRef, Bracelets, LoginView, ListView, MenuView, BraceletView) {
    'use strict';

    var Workspace = Backbone.Router.extend({
      routes: {
        "bracelet": "bracelet",
        "bracelet/:id": "bracelet",
        "list": "showList",
        "login": "showLogin",
        "logout": "logout",
        "*path": "defaultRoute"
      },
      initialize: function() {
        //this function runs on every page load
        this.LoginView = new LoginView({ model: RootRef });
        this.ListView = new ListView({ collection: Bracelets });
        this.MenuView = new MenuView({ model: RootRef });
        this.BraceletView = new BraceletView();

        //always render menu when authenticated
        if (RootRef.firebase.getAuth()) {
          this.MenuView.render();
        }
      },
      defaultRoute: function() {
        if (RootRef.firebase.getAuth() === null) {
          this.navigate("#/login", { trigger: true });
        } else {
          this.navigate("#/list", { trigger: true });
        }
      },
      showLogin: function() {
        this.MenuView.removeTemplate();
        this.LoginView.render();
      },
      showList: function() {
        if (RootRef.firebase.getAuth() === null) {
          this.navigate("#/login", { trigger: true });
        } else {
          this.MenuView.render();
          this.ListView.render();
        }
      },
      bracelet: function(id) {
        if (RootRef.firebase.getAuth() === null) {
          this.navigate("#/login", { trigger: true });
        } else {
          this.BraceletView.render(id);
        }
      },
      logout: function() {
        try {
          RootRef.firebase.unauth();
        } catch(e){}

        this.navigate("#/login", { trigger: true });
      }
    });

    return Workspace;
  }
)
