define(
  ['jquery', 'backbone',
  'models/rootRef',
  'views/menu', 'views/productDetail'
  ],
  function($, Backbone, RootRef, MenuView, ProductDetailView) {
    'use strict';

    var Workspace = Backbone.Router.extend({
      routes: {
        "*path": "defaultRoute"
      },
      initialize: function() {
        //this function runs on every page load
        this.MenuView = new MenuView();
        this.ProductDetailView = new ProductDetailView();
      },
      defaultRoute: function() {
        this.MenuView.render();
        this.ProductDetailView.render();
      }
    });

    return Workspace;
  }
)
