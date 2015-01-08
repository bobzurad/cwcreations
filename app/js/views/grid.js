define(
  ['jquery', 'underscore', 'backbone', 'text!templates/grid.html'],
  function($, _, Backbone, gridTemplate) {
    'use strict';

    var GridView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(gridTemplate),

      render: function() {
        this.$el.html(this.template());

        return this;
      }

    });

    return GridView;
  }
);
