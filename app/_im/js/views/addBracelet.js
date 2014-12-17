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

      initialize: function() {
        this.listenTo(this.model, 'invalid', this.showErrors);
      },

      render: function() {
        this.$el.html(this.template());

        this.$name = this.$("#name");
        this.$description = this.$("#description");
        this.$price = this.$("#price");
        this.$salePrice = this.$("#salePrice");
        this.$isOnSale = this.$("#isOnSale");

        return this;
      },

      removeTemplate: function() {
        this.$el.children().remove();
      },

      saveClick: function(e) {
        this.model.set({
          name: this.$name.val(),
          description: this.$description.val(),
          price: parseFloat(Number(this.$price.val().replace(/[^0-9\.]+/g,""))),
          salePrice: this.$salePrice.val(),
          isOnSale: this.$isOnSale.is(":checked")
        });

        if (this.model.isValid()) {
          console.log("valid");
        } else {
          console.log("invalid!");
        }
      },

      showErrors: function(model, errors) {
        console.log("show errors");
      }
    });

    return AddBraceletView;
  }
);
