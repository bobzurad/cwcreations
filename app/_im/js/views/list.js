define(
  ['jquery','underscore', 'backbone', 'text!templates/list.html'],
  function ($, _, Backbone, listTemplate) {
    'use strict';

    var ListView = Backbone.View.extend({
      el: '#inventory',

      template: _.template(listTemplate),

      render: function() {
        this.$el.html(this.template({
          //TODO: this is hardcoded to facebook
          name: this.model.firebase.getAuth().facebook.displayName,
          bracelets: this.model
        }));

        return this;
      },

      removeTemplate: function() {
        this.$el.children().remove();
      },

    });

    return ListView;
  }
);
