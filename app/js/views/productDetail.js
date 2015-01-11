define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productDetail.html',
  'collections/images'],
  function($, _, Backbone, productDetailTemplate, Images) {
    'use strict';

    var ProductDetailView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(productDetailTemplate),

      initialize: function() {
        this.images = new Images(undefined, { id: this.model.id });
        this.listenTo(this.images, 'sync', this.imagesLoaded);
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
