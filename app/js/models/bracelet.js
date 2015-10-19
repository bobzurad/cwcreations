define(
  ['underscore', 'backbone'],
  function(_, Backbone) {
    'use strict';

    var Bracelet = Backbone.Model.extend({
      validate: function(attrs, options) {
        var errors = [];

        if (attrs.name.length === 0) {
          errors.push({ attr: "name", msg: "Name is required." });
        }

        if (attrs.description.length === 0) {
          errors.push({ attr: "description", msg: "Description is required." });
        }

        if (attrs.price <= 0) {
          errors.push({ attr: "price", msg: "Price is invalid." });
        }

        if (attrs.isOnSale && attrs.salePrice <= 0) {
          errors.push({ attr: "salePrice", msg: "Sale Price is invalid." });
        }

        if (errors.length > 0) {
          return errors;
        }
      }
    });

    return Bracelet;
  }
);
