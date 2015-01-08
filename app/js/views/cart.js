define(
  ['jquery', 'underscore', 'backbone', 'text!templates/cart.html'],
  function($, _, Backbone, cartTemplate) {
    'use strict';

    var CartView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(cartTemplate),

      render: function() {
        this.$el.html(this.template());

        return this;
      }

    });

    return CartView;
  }
);
