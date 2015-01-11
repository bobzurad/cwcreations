define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productTile.html'],
  function($, _, Backbone, productTileTemplate) {
    'use strict';

    var ProductTileView = Backbone.View.extend({

      template: _.template(productTileTemplate),

      //this runs on page load
      initialize: function() {

      },

      events: {
        'click button.btnBuyNow': 'addToCart'
      },

      render: function() {
        this.$el.html(this.template({ model: this.model.attributes }));

        return this;
      },

      addToCart: function(e) {
        window.location.hash = '#/cart';
      }

    });

    return ProductTileView;
  }
);
