define(
  ['jquery', 'underscore', 'backbone',
  'models/common',
  'models/image',
  'collections/images',
  'text!templates/_im/image.html'],
  function($, _, Backbone, Common, Image, Images, imageTemplate) {
    'use strict';

    var ImageView = Backbone.View.extend({
      'el': '.imageContainer',

      template: _.template(imageContainer)
    });

    return ImageView;
  }
);
