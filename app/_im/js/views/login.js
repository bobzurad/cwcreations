define(
  ['jquery','underscore','backbone'],
  function ($, _, Backbone) {
    'use strict';

    var LoginView = Backbone.View.extend({
      el: '#login'

    });

    return LoginView;
  }
);
