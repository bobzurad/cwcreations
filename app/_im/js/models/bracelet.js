define(
  ['underscore', 'backbone'],
  function(_, Backbone) {
    'use strict';

    var Bracelet = Backbone.Model.extend({
      validate: function(attrs, options) {
        if (attrs.name.length === 0) {
          return "name is required";
        }
      }
    });

    return Bracelet;
  }
)
