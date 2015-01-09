define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productTile.html'],
  function($, _, Backbone, productTileTemplate) {
    'use strict';

    var ProductTileView = Backbone.View.extend({
      el: '.container-item',

      template: _.template(productTileTemplate),

      render: function() {
        this.$el.html(this.template({ model: this.model.attributes }));

        return this;
      }

    });

    return ProductTileView;
  }
);
