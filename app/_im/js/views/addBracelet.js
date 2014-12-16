define(
  ['jquery', 'underscore', 'backbone', 'models/bracelet', 'text!templates/addBracelet.html'],
  function($, _, Backbone, Bracelet, addBraceletTemplate) {
    'use strict';

    var AddBraceletView = Backbone.View.extend({
      'el': '#addBracelet',

      template: _.template(addBraceletTemplate),

      events: {
        "click #save": "saveClick"
      },

      render: function() {
        this.$el.html(this.template());

        this.$name = this.$("#name");
        this.$description = this.$("#description");
        this.$price = this.$("#price");
        this.$salePrice = this.$("#salePrice");
        this.isOnSale = this.$("#isOnSale").is(":checked");

        return this;
      },

      removeTemplate: function() {
        this.$el.children().remove();
      },

      saveClick: function(e) {
        var bracelet = new Bracelet({
          name: this.$name.val(),
          description: this.$description.val(),
          price: this.$price.val(),
          salePrice: this.$salePrice.val(),
          isOnSale: this.isOnSale
        });

        if (bracelet.isValid()) {
          console.log("valid");
        } else {
          console.log("invalid!");
        }
      }
    });

    return AddBraceletView;
  }
);
