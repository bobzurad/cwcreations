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

      template: _.template(imageTemplate),

      render: function() {
        //render template
        this.$el.html(this.template({ model: this.model }));

        //DOM bindings
        this.$deleteWarning = this.$("#deleteWarning");

        if (this.model.imageData == Common.DefaultThumbnailImage) {
          this.$deleteWarning.hide();
        }

        return this;
      }
    });

    return ImageView;
  }
);
