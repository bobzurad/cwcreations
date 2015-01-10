define(
  ['jquery', 'underscore', 'backbone', 'text!templates/productTile.html', 'views/productDetail'],
  function($, _, Backbone, productTileTemplate, ProductDetailView) {
    'use strict';

    var ProductTileView = Backbone.View.extend({

      template: _.template(productTileTemplate),

      //this runs on page load
      initialize: function() {
        this.$productDetailModal = $("#productDetailModal");
      },

      events: {
        'click button.btnBuyNow': 'addToCart',
        'click button.btnMorePhotos': 'showModal'
      },

      render: function() {
        this.$el.html(this.template({ model: this.model.attributes }));

        return this;
      },

      addToCart: function(e) {
        window.location.hash = '#/cart';
      },

      showModal: function(e) {
        var view = new ProductDetailView();

        this.$productDetailModal.find(".modal-title").text($(this).data("productname"));
        //TODO: view isn't ready to be rendered yet
        //this.$productDetailModal.find(".modal-body").html(view.render().el);

        this.$productDetailModal.modal();
      }

    });

    return ProductTileView;
  }
);
