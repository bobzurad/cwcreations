define(
  ['jquery','underscore', 'backbone', 'text!templates/list.html'],
  function ($, _, Backbone, listTemplate) {
    'use strict';

    var ListView = Backbone.View.extend({
      el: '#list',

      template: _.template(listTemplate),

      initialize: function() {
        this.listenTo(this.collection, 'sync', this.render);
      },

      render: function() {
        this.$el.html(this.template({
          bracelets: this.collection.models
        }));

        return this;
      },

      removeTemplate: function() {
        this.$el.children().remove();
      }

    });

    return ListView;
  }
);
