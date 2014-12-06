define(
  ['underscore', 'backbone', 'firebase', 'backbonefire'],
  function(_, Backbone) {
    'use strict';

    var RootRef = Backbone.Firebase.Model.extend({
      url: 'https://cwcreations.firebaseio.com/'
    });

    return new RootRef();
  }
)
