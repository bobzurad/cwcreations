define(
  ['underscore', 'backbone', 'models/common', 'models/image', 'firebase', 'backbonefire'],
  function(_, Backbone, Common, Image) {
    'use strict';

    var ImagesCollection = Backbone.Firebase.Collection.extend({
      model: Image,

      initialize: function(models, options) {
        this.url = Common.FirebaseUrl + "images/" + options.id;
      }
    });

    return ImagesCollection;
  }
)
