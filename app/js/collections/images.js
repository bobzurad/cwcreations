define(
  ['underscore', 'backbone', 'models/image', 'models/common', 'firebase', 'backbonefire'],
  function(_, Backbone, Image, Common) {
    'use strict';

    var ImagesCollection = Backbone.Firebase.Collection.extend({
      model: Image,

      url: Common.FirebaseUrl + "images/" + "b1"
    });

    return new ImagesCollection();
  }
)
