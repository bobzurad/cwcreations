define(
  ['jquery', 'underscore', 'backbone', 'currency', 'models/common', 'text!templates/productTile.html'],
  function($, _, Backbone, currency, Common, productTileTemplate) {
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
        var self = this;

        //render template
        this.$el.html(this.template({ model: this.model.attributes }));

        //DOM reference to element that'll contain tile image
        this.$productTile = this.$(".productTile");

        //get reference to tile image
        this.ThumbnailFbModelRef = Backbone.Firebase.Model.extend({
          url: Common.FirebaseUrl + "thumbnails/" + this.model.get("id"),
          autoSync: false
        });

        //get tile image
        this.ThumbnailFbModel = new this.ThumbnailFbModelRef();
        this.ThumbnailFbModel.on('sync', function(e) {
          self.$productTile.attr("style", "background-image: url(" + this.get("imageData") + ")");
        });
        this.ThumbnailFbModel.fetch();

        return this;
      },

      addToCart: function(e) {
        window.location.hash = '#/cart';
      }

    });

    return ProductTileView;
  }
);
