define(
  ['jquery', 'underscore', 'backbone', 'text!templates/home.html', 'views/productTile'],
  function($, _, Backbone, homeTemplate, ProductTileView) {
    'use strict';

    var HomeView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(homeTemplate),

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

    return HomeView;
  }
);
