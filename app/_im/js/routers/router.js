define(
  ['jquery', 'backbone',
    'models/rootRef', 'models/bracelet',
    'collections/bracelets',
    'views/login', 'views/list', 'views/menu', 'views/bracelet'
  ],
  function($, Backbone, RootRef, Bracelet, Bracelets, LoginView, ListView, MenuView, BraceletView) {
    //TODO: this router is doing too much.
    //  Bracelets, ListView and MenuView shouldn't be loaded unless we're authenticated with firebase.
    //  Perhaps make login it's own app? Or give login it's own router?
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
        this.BraceletView = new BraceletView({ model: new Bracelet() });

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
        this.ListView.removeTemplate();
        this.MenuView.removeTemplate();
        this.BraceletView.removeTemplate();
        this.LoginView.render();
      },
      showList: function() {
        if (RootRef.firebase.getAuth() === null) {
          this.navigate("#/login", { trigger: true });
        } else {
          this.LoginView.removeTemplate();
          this.BraceletView.removeTemplate();
          this.MenuView.render();
          this.ListView.render();
        }
      },
      bracelet: function(id) {
        if (RootRef.firebase.getAuth() === null) {
          this.navigate("#/login", { trigger: true });
        } else {
          this.ListView.removeTemplate();
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
