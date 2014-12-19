define(
  ['underscore', 'backbone', 'models/bracelet', 'firebaseConfig', 'firebase', 'backbonefire'],
  function(_, Backbone, Bracelet, firebaseConfig) {
    'use strict';

    var BraceletsCollection = Backbone.Firebase.Collection.extend({
      model: Bracelet,

      url: firebaseConfig.url + 'bracelets'
    });

    return new BraceletsCollection();
  }
)
