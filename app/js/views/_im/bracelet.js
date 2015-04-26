define(
  ['jquery', 'underscore', 'backbone',
  'models/common',
  'models/bracelet',
  'collections/bracelets',
  'text!templates/_im/bracelet.html',
  'views/_im/image',
  'models/image'],
  function($, _, Backbone, Common, Bracelet, Bracelets, braceletTemplate,
    ImageView, ImageModel) {
    'use strict';

    var BraceletView = Backbone.View.extend({
      'el': '#viewContainer',

      template: _.template(braceletTemplate),

      events: {
        "click #save": "saveClick",
        "click a[href=#images]": "loadImages",
        'show.bs.tab a[data-toggle="tab"]': 'tabClicked',
        "click #deleteWarning": "loadImageToDelete",
        "click #deleteImage": "deleteImage",
        "click #deleteProduct": "deleteProduct"
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
        //load model and render template

        if (id && Bracelets.models.length > 0) {
          //for edit
          this.ImageModels = [];
          this.ImageViews = [];
          this.ImageModelRef = undefined;

          this.model = Bracelets.get(id);
          this.$el.html(this.template({ model: this.model.attributes }));
          this.$(".photoArea").show();
          this.$('a[data-toggle="tab"]').parent().removeClass("disabled");
        } else {
          //for create
          this.model = new Bracelet();
          this.$el.html(this.template({ model: {} }));
          this.ThumbnailModel = undefined;
        }

        //DOM bindings
        this.$name = this.$("#name");
        this.$description = this.$("#description");
        this.$price = this.$("#price");
        this.$salePrice = this.$("#salePrice");
        this.$isOnSale = this.$("#isOnSale");
        this.$thumbnailUpload = this.$("#thumbnailUpload");
        this.$imageUpload = this.$("#imageUpload");
        if (this.model.get("isOnSale")) {
          this.$isOnSale.prop("checked", "checked");
        }

        //events
        this.listenTo(this.model, 'invalid', this.showErrors);
        this.$thumbnailUpload.on("change", $.proxy(this.readImage, this));
        this.$imageUpload.on("change", $.proxy(this.readImage, this));

        //reference for thumbnail image
        //refresh reference when model id has changed
        if ((this.ThumbnailModel === undefined && this.model.get("id") != undefined)
          || (this.ThumbnailModel != undefined && this.model.get("id") != this.ThumbnailModel.get("id"))) {
          this.ThumbnailModelRef = Backbone.Firebase.Model.extend({
            url: Common.FirebaseUrl + "thumbnails/" + this.model.get("id"),
            autoSync: false
          });

          this.ThumbnailModel = new this.ThumbnailModelRef();
          this.ThumbnailModel.on('sync', this.thumbnailSynced);
          this.ThumbnailModel.fetch();
        }

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

          //create thumbnail reference
          this.ThumbnailModelRef = Backbone.Firebase.Model.extend({
            url: Common.FirebaseUrl + "thumbnails/" + this.model.get("id"),
            autoSync: false
          });
          this.ThumbnailModel = new this.ThumbnailModelRef();
          this.ThumbnailModel.save({
            imageData: Common.DefaultThumbnailImage,
            isThumbnail: true
          })

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
        var isThumbnail = e.currentTarget.getAttribute("id") == "thumbnailUpload";

        reader.onload = function(e) {
          if (isThumbnail) {
            self.ThumbnailModel.save({
              isThumbnail: true,
              imageData: reader.result
            });
          } else {
            self.ImageModels.set(Common.getGuid(), reader.result);
            self.ImageModels.save();
          }
        }

        if (file) {
          reader.readAsDataURL(file);
        }
      },

      loadImageToDelete: function(e) {
        var $img = $(e.currentTarget).parent().parent().find("img");

        this.$("#imageToDelete").prop("src", $img.prop("src"));

        //deleting a thumbnail or other image?
        if ($img.data("isthumbnail") === true) {
          this.$("#deleteImage").data("imageIndex", "thumbnail");
        } else {
          this.$("#deleteImage").data("imageIndex", $img.data("imageindex"));
          this.$("#deleteImage").data("imagekey", $img.data("imagekey"));
        }
      },

      deleteImage: function(e) {
        var imageIndex = $(e.currentTarget).data("imageIndex");
        var imageKey = $(e.currentTarget).data("imagekey");

        if (imageIndex === "thumbnail") {
          this.ThumbnailModel.save({
            imageData: Common.DefaultThumbnailImage
          });
        } else if (parseInt(imageIndex) >= 0 && parseInt(imageIndex) <= 9) {
          this.ImageModels.unset(imageKey);
          this.ImageModels.save();
          this.ImageViews[imageIndex].remove(); //remove the view from the DOM
          this.ImageViews.remove(imageIndex);   //remove the view from the collection
          //reset indexes on remaining images
          _.each(this.ImageViews, function(imageView, i) {
            //TODO: figure out why setting the model here doesn't update data-imageIndex in the respective view
            imageView.model.imageIndex = i;
          });
        }

        this.$("#warningModal").modal('hide');
      },

      tabClicked: function(e) {
        //don't switch to tab if it's disabled
        if ($(e.currentTarget).parent().hasClass("disabled")) {
          e.preventDefault();
          return false;
        }
      },

      loadImages: function(e) {
        if (this.ImageModelRef === undefined) {
          this.ImageModelRef = Backbone.Firebase.Model.extend({
            url: Common.FirebaseUrl + "images/" + this.model.get("id"),
            autoSync: false
          });

          this.ImageModels = new this.ImageModelRef();
          this.ImageModels.on('sync', $.proxy(this.imagesSynced, this));
          this.ImageModels.fetch();
        }
      },

      imagesSynced: function(imagesModel) {
        //TODO: how would this behave if 10 people were adding to the Model?
        var self = this;

        //create an ImageModel and ImageView for each image and push it onto a collection
        _.each(imagesModel.keys(), function(key, i) {
          if (self.$("#" + key).length === 0 && imagesModel.get(key) !== null) {
            //create DOM element to attach to
            $('<div id="' + key + '"></div>').appendTo("#imageList");

            //create ImageModel and ImageView
            var imageModel = new ImageModel({
              imageData: imagesModel.get(key),
              imageIndex: i,
              imageKey: key
            });
            var imageView = new ImageView({
              model: imageModel.attributes,
              el: "#" + key
            });
            imageView.render();
            self.ImageViews.push(imageView);
          }
        });
      },

      thumbnailSynced: function(thumbnailModel) {
        //load ImageView for thumbnail image
        this.thumbnailImageView = new ImageView({
          model: thumbnailModel.attributes,
          el: "#thumbnailImage"
        });

        this.thumbnailImageView.render();
      },

      deleteProduct: function(e) {
        Bracelets.remove(this.model.attributes);
        window.location.hash = "#/list";
      }
    });

    return BraceletView;
  }
);
