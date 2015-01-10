define(
  ['jquery', 'backbone',
  'models/rootRef',
  'collections/bracelets',
  'views/menu', 'views/home', 'views/about', 'views/cart', 'views/contact', 'views/grid'
  ],
  function($, Backbone, RootRef, Bracelets,
    MenuView, HomeView, AboutView, CartView, ContactView, GridView) {
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
      },

      defaultRoute: function() {
        this.HomeView = new HomeView({ collection: Bracelets });

        this.MenuView.render();
        this.HomeView.render();
      },

      aboutRoute: function() {
        this.AboutView = new AboutView();

        this.MenuView.render();
        this.AboutView.render();
      },

      cartRoute: function() {
        this.CartView = new CartView();

        this.MenuView.render();
        this.CartView.render();
      },

      contactRoute: function() {
        this.ContactView = new ContactView();

        this.MenuView.render();
        this.ContactView.render();
      },

      gridRoute: function() {
        this.GridView = new GridView({ collection: Bracelets });
        
        this.MenuView.render();
        this.GridView.render();
      }

    });

    return Workspace;
  }
)
