define(
  ['underscore', 'backbone', 'models/common', 'firebase', 'backbonefire'],
  function(_, Backbone, Common) {
    'use strict';

    var RootRef = Backbone.Firebase.Model.extend({
      url: Common.FirebaseUrl
    });

    return new RootRef();
  }
)
