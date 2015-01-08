define(
  ['jquery', 'underscore', 'backbone', 'text!templates/home.html'],
  function($, _, Backbone, homeTemplate) {
    'use strict';

    var HomeView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(homeTemplate),

      render: function() {
        this.$el.html(this.template());

        return this;
      }

    });

    return HomeView;
  }
);
