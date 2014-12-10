define(
  ['jquery', 'underscore', 'backbone', 'text!templates/menu.html'],
  function($, _, Backbone, menuTemplate) {
    'use strict';

    var MenuView = Backbone.View.extend({
      el: '#menuView',

      template: _.template(menuTemplate),

      render: function() {
        //only render view if authenticated with firebase
        if (this.model.firebase.getAuth()) {
          this.$el.html(this.template());
        }

        return this;
      },

      removeTemplate: function() {
        this.$el.children().remove();
      }

    });

    return MenuView;
  }
);
