define(
  ['jquery', 'underscore', 'backbone',
  'models/common',
  'models/bracelet',
  'collections/bracelets',
  'text!templates/_im/bracelet.html'],
  function($, _, Backbone, Common, Bracelet, Bracelets, braceletTemplate) {
    'use strict';

    var BraceletView = Backbone.View.extend({
      'el': '#viewContainer',

      template: _.template(braceletTemplate),

      events: {
        "click #save": "saveClick",
        "click #deleteImage": "deleteImage",
        "click #deleteWarning": "loadImageToDelete",
        'show.bs.tab a[data-toggle="tab"]': 'tabClicked'
      },

      initialize: function() {
        this.listenTo(Bracelets, 'sync', this.modelLoaded);
      },

      modelLoaded: function() {
        if (window.location.hash.indexOf("bracelet") > 0) {
          //TODO: there's got to be a better way to get the id of the model we're editing
          this.render(window.location.hash.substr(11));
        }
      },

      render: function(id) {
        if (id && Bracelets.models.length > 0) {
          this.model = Bracelets.get(id);
          this.$el.html(this.template({ model: this.model.attributes }));
          this.$(".photoArea").show();
          this.$('a[data-toggle="tab"]').parent().removeClass("disabled");
        } else {
          this.model = new Bracelet();
          this.$el.html(this.template({ model: {} }));
        }

        this.listenTo(this.model, 'invalid', this.showErrors);

        this.$name = this.$("#name");
        this.$description = this.$("#description");
        this.$price = this.$("#price");
        this.$salePrice = this.$("#salePrice");
        this.$isOnSale = this.$("#isOnSale");
        this.$thumbnailUpload = this.$("#thumbnailUpload");
        this.$thumbnail = this.$("#thumbnail");

        if (this.model.get("isOnSale")) {
          this.$isOnSale.prop("checked", "checked");
        }

        if (this.model.get("thumbnail") == Common.DefaultThumbnailImage
          || this.model.get("thumbnail") === undefined)
        {
          this.$thumbnail.prop("src", Common.DefaultThumbnailImage);
          $("#deleteWarning").hide();
        } else {
          this.$thumbnail.prop("src", this.model.get("thumbnail"));
        }

        this.$thumbnailUpload.on("change", $.proxy(this.readImage, this));

        return this;
      },

      saveClick: function(e) {
        //set values on the model
        this.model.set({
          name: this.$name.val(),
          description: this.$description.val(),
          price: parseFloat(Number(this.$price.val().replace(/[^0-9\.]+/g,""))),
          salePrice: parseFloat(Number(this.$salePrice.val().replace(/[^0-9\.]+/g,""))),
          isOnSale: this.$isOnSale.is(":checked")
        });

        //clear previous validation errors
        this.$(".has-error").removeClass("has-error");
        this.$(".validationMessage").text("");

        //perform validation and save
        if (this.model.isValid()) {
          //if the collection contains a model with the same .attributes.id,
          //firebase will update the existing model in the colleciton, rather than add a new model
          Bracelets.create(this.model.attributes);

          window.location.hash = "#/list";
        }
      },

      showErrors: function(model, errors) {
        _.each(errors, function(error) {
          this.$("#" + error.attr).parent().addClass("has-error");
          this.$("#" + error.attr).siblings().find(".validationMessage").text(error.msg);
        }, this);
      },

      readImage: function(e) {
        var self = this;
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
          self.model.set({
            thumbnail: reader.result
          });
        }

        if (file) {
          reader.readAsDataURL(file);
        }
      },

      loadImageToDelete: function(e) {
        this.$("#imageToDelete").prop("src", $(e.currentTarget).parent().parent().find("img").prop("src"));
        //deleting a thumbnail or other image?
        if ($(e.currentTarget).parent().parent().find("#thumbnail").length) {
          this.$("#deleteImage").data("imageId", "thumbnail");
        } else {
          this.$("#deleteImage").data("imageId", "INSERT_IMAGE_ID_HERE");
        }
      },

      deleteImage: function(e) {
        var imageId = $(e.currentTarget).data("imageId");

        if (imageId === "thumbnail") {
          this.model.set({
            thumbnail: Common.DefaultThumbnailImage
          });
        }
      },

      tabClicked: function(e) {
        //don't switch to tab if it's disabled
        if ($(e.currentTarget).parent().hasClass("disabled")) {
          e.preventDefault();
          return false;
        }
      }
    });

    return BraceletView;
  }
);
