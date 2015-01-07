define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productDetail.html'],
  function($, _, Backbone, productDetailTemplate) {
    'use strict';

    var ProductDetailView = Backbone.View.extend({
      el: '#productDetailView',

      template: _.template(productDetailTemplate),

      render: function() {
        this.$el.html(this.template());

        return this;
      }

    });

    return ProductDetailView;
  }
);
