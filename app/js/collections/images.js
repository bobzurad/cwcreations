define(
  ['underscore', 'backbone', 'models/image', 'models/common', 'firebase', 'backbonefire'],
  function(_, Backbone, Image, Common) {
    'use strict';

    var ImagesCollection = Backbone.Firebase.Collection.extend({
      autoSync: false,      //no autosync for images for fear of loading too much data

      model: Image,

      url: Common.FirebaseUrl + "images"
    });

    return new ImagesCollection();
  }
)
