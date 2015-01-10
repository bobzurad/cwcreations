define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productDetail.html'],
  function($, _, Backbone, productDetailTemplate) {
    'use strict';

    var ProductDetailView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(productDetailTemplate),

      events: {
        'click button.btnBuyNow': 'addToCart'
      },

      render: function() {
        this.$el.html(this.template());

        return this;
      },

      addToCart: function() {
        
      }

    });

    return ProductDetailView;
  }
);
