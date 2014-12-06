define(
  ['underscore', 'backbone', 'models/bracelet', 'firebase', 'backbonefire'],
  function(_, Backbone, Bracelet) {
    'use strict';

    var BraceletsCollection = Backbone.Firebase.Collection.extend({
      model: Bracelet,

      url: 'https://cwcreations.firebaseio.com/bracelets'
    });

    return new BraceletsCollection();
  }
)
