define(
  ['jquery', 'underscore', 'backbone', 'text!templates/addBracelet.html'],
  function($, _, Backbone, addBraceletTemplate) {
    'use strict';

    var AddBraceletView = Backbone.View.extend({
      'el': '#addBracelet',

      template: _.template(addBraceletTemplate),

      events: {
        "click #save": "saveClick"
      },

      render: function() {
        this.$el.html(this.template());
        return this;
      },

      removeTemplate: function() {
        this.$el.children().remove();
      },

      saveClick: function(e) {
        console.log("save clicked");
      }
    });

    return AddBraceletView;
  }
);
