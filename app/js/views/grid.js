define(
  ['jquery', 'underscore', 'backbone', 'text!templates/grid.html', 'views/productTile'],
  function($, _, Backbone, gridTemplate, ProductTileView) {
    'use strict';

    var GridView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(gridTemplate),

      initialize: function() {
        this.listenTo(this.collection, 'sync', this.renderTiles);
      },

      render: function() {
        this.$el.html(this.template());

        this.$tileContainer = $("#tileContainer");

        if (this.$tileContainer.children().length === 0 && this.collection.length > 0) {
          this.renderTiles();
        }

        return this;
      },

      renderTiles: function() {
        var self = this;

        this.$tileContainer.empty();

        this.collection.each(function(bracelet) {
          var view = new ProductTileView({ model: bracelet });
          self.$tileContainer.append(view.render().el);
        });
      }

    });

    return GridView;
  }
);
