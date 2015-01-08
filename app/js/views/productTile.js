define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productTile.html'],
  function($, _, Backbone, productTileTemplate) {
    'use strict';

    var ProductTileView = Backbone.View.extend({
      el: '.productTileContainer',

      template: _.template(productTileTemplate),

      render: function() {
        this.$el.html(this.template());

        return this;
      }

    });

    return ProductTileView;
  }
);
