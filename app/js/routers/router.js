define(
  ['jquery', 'backbone',
  'models/rootRef',
  'views/menu', 'views/home', 'views/about', 'views/cart', 'views/contact', 'views/grid'
  ],
  function($, Backbone, RootRef, MenuView, HomeView, AboutView, CartView, ContactView, GridView) {
    'use strict';

    var Workspace = Backbone.Router.extend({

      routes: {
        "home": "defaultRoute",
        "about": "aboutRoute",
        "cart": "cartRoute",
        "contact": "contactRoute",
        "grid": "gridRoute",
        "*path": "defaultRoute"
      },

      initialize: function() {
        //this function runs on every page load
        this.MenuView = new MenuView();
        this.HomeView = new HomeView();
        this.AboutView = new AboutView();
        this.CartView = new CartView();
        this.ContactView = new ContactView();
        this.GridView = new GridView();
      },

      defaultRoute: function() {
        this.MenuView.render();
        this.HomeView.render();
      },

      aboutRoute: function() {
        this.MenuView.render();
        this.AboutView.render();
      },

      cartRoute: function() {
        this.MenuView.render();
        this.CartView.render();
      },

      contactRoute: function() {
        this.MenuView.render();
        this.ContactView.render();
      },

      gridRoute: function() {
        this.MenuView.render();
        this.GridView.render();
      }

    });

    return Workspace;
  }
)
