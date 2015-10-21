define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productDetail.html',
  'models/common', 'collections/images'],
  function($, _, Backbone, productDetailTemplate, Common, Images) {
    'use strict';

    var ProductDetailView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(productDetailTemplate),

      initialize: function() {
        //TODO: we're using the wrong Images here.
        //  remove this and get images from images/id
        this.listenTo(Images, 'sync', this.imagesLoaded);
      },

      events: {
        'click button.btnBuyNow': 'addToCart'
      },

      render: function() {
        this.$el.html(this.template({ model: this.model.attributes }));

        return this;
      },

      addToCart: function() {

      },

      imagesLoaded: function() {
        console.log("images loaded");
      }

    });

    return ProductDetailView;
  }
);
