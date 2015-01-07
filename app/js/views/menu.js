define(
  ['jquery', 'underscore', 'backbone', 'text!templates/menu.html'],
  function($, _, Backbone, menuTemplate) {
    'use strict';

    var MenuView = Backbone.View.extend({
      el: '#menuView',

      template: _.template(menuTemplate),

      render: function() {
        this.$el.html(this.template());

        return this;
      }

    });

    return MenuView;
  }
);
