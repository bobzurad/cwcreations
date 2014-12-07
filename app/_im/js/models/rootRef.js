define(
  ['underscore', 'backbone', 'firebaseConfig', 'firebase', 'backbonefire'],
  function(_, Backbone, firebaseConfig) {
    'use strict';

    var RootRef = Backbone.Firebase.Model.extend({
      url: firebaseConfig.url
    });

    return new RootRef();
  }
)
