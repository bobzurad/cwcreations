define(
  ['jquery', 'backbone',
  'models/rootRef',
  'models/common',
  'collections/bracelets',
  'views/home', 'views/about', 'views/cart', 'views/contact', 'views/grid',
  'views/productDetail'
  ],
  function($, Backbone, RootRef, Common, Bracelets,
    HomeView, AboutView, CartView, ContactView, GridView, ProductDetailView) {
    'use strict';

    var Workspace = Backbone.Router.extend({

      routes: {
        "home": "defaultRoute",
        "about": "aboutRoute",
        "cart": "cartRoute",
        "contact": "contactRoute",
        "grid": "gridRoute",
        "detail/:id": "detailRoute",
        "*path": "defaultRoute"
      },

      initialize: function() {
        //this function runs on every page load

      },

      defaultRoute: function() {
        this.HomeView = new HomeView({ collection: Bracelets });
        this.HomeView.render();
      },

      aboutRoute: function() {
        this.AboutView = new AboutView();
        this.AboutView.render();
      },

      cartRoute: function() {
        this.CartView = new CartView();
        this.CartView.render();
      },

      contactRoute: function() {
        this.ContactView = new ContactView();
        this.ContactView.render();
      },

      gridRoute: function() {
        this.GridView = new GridView({ collection: Bracelets });
        this.GridView.render();
      },

      detailRoute: function(id) {
        var self = this;
        var model = Bracelets.get(id);

        if (model === undefined) {
          //bracelets collection probably isn't synced yet
          //use case: user came from external source or refreshed page at /detail/id
          this.listenToOnce(Bracelets, 'sync', function(e) {
            model = Bracelets.get(id);
            self.ProductDetailView = new ProductDetailView({ model: model.attributes })
            self.ProductDetailView.render();
          });

          return;
        }

        this.ProductDetailView = new ProductDetailView({ model: model.attributes });
        this.ProductDetailView.render();
      }

    });

    return Workspace;
  }
)
