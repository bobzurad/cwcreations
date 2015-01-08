define(
  ['jquery', 'underscore', 'backbone', 'text!templates/contact.html'],
  function($, _, Backbone, contactTemplate) {
    'use strict';

    var ContactView = Backbone.View.extend({
      el: '#viewContainer',

      template: _.template(contactTemplate),

      render: function() {
        this.$el.html(this.template());

        return this;
      }

    });

    return ContactView;
  }
);
