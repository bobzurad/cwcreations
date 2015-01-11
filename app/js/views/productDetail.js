define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productDetail.html',
  'models/common', 'collections/images'],
  function($, _, Backbone, productDetailTemplate, Common, Images) {
    'use strict';

    var ProductDetailView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(productDetailTemplate),

      initialize: function() {
        this.listenTo(Images, 'sync', this.imagesLoaded);
      },

      events: {
        'click button.btnBuyNow': 'addToCart'
      },

      render: function() {
        this.$el.html(this.template());

        return this;
      },

      addToCart: function() {

      },

      imagesLoaded: function() {

      }

    });

    return ProductDetailView;
  }
);
