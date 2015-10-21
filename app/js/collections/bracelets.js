define(
  ['underscore', 'backbone', 'models/bracelet', 'models/common', 'firebase', 'backbonefire'],
  function(_, Backbone, Bracelet, Common) {
    'use strict';

    var BraceletsCollection = Backbone.Firebase.Collection.extend({
      model: Bracelet,

      url: Common.FirebaseUrl + 'bracelets'
    });

    return new BraceletsCollection();
  }
);
