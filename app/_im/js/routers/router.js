define(
  ['jquery', 'backbone',
    'models/rootRef',
    'collections/bracelets',
    'views/login', 'views/list', 'views/menu', 'views/addBracelet'
  ],
  function($, Backbone, RootRef, Bracelets, LoginView, ListView, MenuView, AddBraceletView) {
    //TODO: this router is doing too much.
    //  Bracelets, ListView and MenuView shouldn't be loaded unless we're authenticated with firebase.
    //  Perhaps make login it's own app? Or give login it's own router?
    'use strict';

    var Workspace = Backbone.Router.extend({
      routes: {
        "addBracelet": "addBracelet",
        "list": "showList",
        "login": "showLogin",
        "logout": "logout",
        "*path": "defaultRoute"
      },
      initialize: function() {
        this.LoginView = new LoginView({ model: RootRef });
        this.ListView = new ListView({ collection: Bracelets });
        this.MenuView = new MenuView({ model: RootRef });
        this.AddBraceletView = new AddBraceletView();
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
        this.AddBraceletView.removeTemplate();
        this.LoginView.render();
      },
      showList: function() {
        if (RootRef.firebase.getAuth() === null) {
          this.navigate("#/login", { trigger: true });
        } else {
          this.LoginView.removeTemplate();
          this.AddBraceletView.removeTemplate();
          this.MenuView.render();
          this.ListView.render();
        }
      },
      addBracelet: function() {
        if (RootRef.firebase.getAuth() === null) {
          this.navigate("#/login", { trigger: true });
        } else {
          this.ListView.removeTemplate();
          this.AddBraceletView.render();
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
