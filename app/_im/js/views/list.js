define(
  ['jquery','underscore', 'backbone', 'text!templates/list.html'],
  function ($, _, Backbone, listTemplate) {
    'use strict';

    var ListView = Backbone.View.extend({
      el: '#inventory',

      template: _.template(listTemplate)

    });

    return ListView;
  }
);
