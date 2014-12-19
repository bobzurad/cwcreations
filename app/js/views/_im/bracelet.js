define(
  ['jquery', 'underscore', 'backbone',
  'models/bracelet',
  'collections/bracelets',
  'text!templates/_im/bracelet.html'],
  function($, _, Backbone, Bracelet, Bracelets, braceletTemplate) {
    'use strict';

    var BraceletView = Backbone.View.extend({
      'el': '#bracelet',

      template: _.template(braceletTemplate),

      events: {
        "click #save": "saveClick"
      },

      initialize: function() {
        this.listenTo(this.model, 'invalid', this.showErrors);
        this.listenTo(Bracelets, 'sync', this.modelLoaded);
      },

      modelLoaded: function() {
        if (window.location.hash.indexOf("bracelet") > 0) {
          //TODO: there's got to be a better way to get the id of the model we're editing
          this.render(window.location.hash.substr(11));
        }
      },

      render: function(id) {
        var model = {};

        if (id && Bracelets.models.length > 0) {
          this.$el.html(this.template({ model: Bracelets.get(id).attributes }));
        } else {
          this.$el.html(this.template({ model: {} }));
        }

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
          if (window.location.hash.indexOf("bracelet/") > 0) {
            //edit
            //TODO: there's got to be a better way to get the id of the model we're editing
            Bracelets.get(window.location.hash.substr(11)).firebase.set(this.model.attributes);
          } else {
            //create
            Bracelets.create(this.model.attributes);
          }

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

    return BraceletView;
  }
);
