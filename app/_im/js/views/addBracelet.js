define(
  ['jquery', 'underscore', 'backbone', 'models/bracelet', 'collections/bracelets', 'text!templates/addBracelet.html'],
  function($, _, Backbone, Bracelet, Bracelets, addBraceletTemplate) {
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
        //set values on the model
        this.model.set({
          name: this.$name.val(),
          description: this.$description.val(),
          price: parseFloat(Number(this.$price.val().replace(/[^0-9\.]+/g,""))),
          salePrice: parseFloat(Number(this.$salePrice.val().replace(/[^0-9\.]+/g,""))),
          isOnSale: this.$isOnSale.is(":checked")
        });

        //clear previous validation errors
        this.$(".has-error").removeClass("has-error");
        this.$(".validationMessage").text("");

        //perform validation and save
        if (this.model.isValid()) {
          Bracelets.create(this.model.attributes);
          window.location.hash = "#/list";
        }
      },

      showErrors: function(model, errors) {
        _.each(errors, function(error) {
          this.$("#" + error.attr).parent().addClass("has-error");
          this.$("#" + error.attr).siblings().find(".validationMessage").text(error.msg);
        }, this);
      }
    });

    return AddBraceletView;
  }
);
