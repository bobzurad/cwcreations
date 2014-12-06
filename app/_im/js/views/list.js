define(
  ['jquery','underscore','backbone'],
  function ($, _, Backbone) {
    'use strict';

    var ListView = Backbone.View.extend({
      el: '#inventory'

    });

    return ListView;
  }
);
