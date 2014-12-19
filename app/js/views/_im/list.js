define(
  ['jquery','underscore', 'backbone', 'text!templates/_im/list.html'],
  function ($, _, Backbone, listTemplate) {
    'use strict';

    var ListView = Backbone.View.extend({
      el: '#inventory',

      template: _.template(listTemplate),

      initialize: function() {
        this.listenTo(this.collection, 'sync', this.render);
      },

      render: function() {
        var auth = this.collection.firebase.getAuth();

        if (auth && window.location.hash.indexOf("list") >= 0) {
          this.$el.html(this.template({
            //TODO: this is hardcoded to facebook
            name: auth.facebook === undefined ? auth.password.email : auth.facebook.displayName,
            bracelets: this.collection.models
          }));
        }

        return this;
      },

      removeTemplate: function() {
        this.$el.children().remove();
      }

    });

    return ListView;
  }
);
