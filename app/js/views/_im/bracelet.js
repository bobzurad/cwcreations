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
        "click #deleteProductWarning": "deleteProductWarning",
        "click #deleteImage": "deleteImage",
        "click #deleteProduct": "deleteProduct"
      },

      initialize: function() {
        this.listenTo(Bracelets, 'sync', this.modelLoaded);

        //Because modelLoaded gets called before the Bracelets collection has been actually synced when .remove() is called
        this.isDeleting = false;
      },

      modelLoaded: function(e) {
        if (window.location.hash.indexOf("bracelet") > 0) {
          //TODO: there's got to be a better way to get the id of the model we're editing
          var id = window.location.hash.substr(11);
          //make sure it wasn't deleted
          if (Bracelets.get(id) !== null && !this.isDeleting) {
            //TODO: for whatever reason, .get(id) still returns the model after 'sync'
            //  has been triggered after Bracelets.remove() was called in deleteProduct.
            this.render(id);
          }
        }
        //Because modelLoaded gets called before the Bracelets collection has been actually synced
        this.isDeleting = false;
      },

      render: function(id) {
        //load model and render template

        if (id && Bracelets.models.length > 0) {
          //for edit
          this.ImageFbModelRef = undefined;
          this.ImageFbModels = [];    //(firebase) collection of (firebase) models at images/{id} for this product
          this.ImageViews = [];       //collection of backbone views attached to the DOM
          this.ImageViewModels = [];  //collection of backbone models for backbone views

          this.model = Bracelets.get(id);
          this.$el.html(this.template({ model: this.model.attributes }));
          this.$(".photoArea").show();
          this.$('a[data-toggle="tab"]').parent().removeClass("disabled");
        } else {
          //for create
          this.ThumbnailFbModel = undefined;
          this.model = new Bracelet();
          this.$el.html(this.template({ model: {} }));
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
        if ((this.ThumbnailFbModel === undefined && this.model.get("id") !== undefined) ||
          (this.ThumbnailFbModel !== undefined && this.model.get("id") != this.ThumbnailFbModel.get("id")))
        {
          this.ThumbnailFbModelRef = Backbone.Firebase.Model.extend({
            url: Common.FirebaseUrl + "thumbnails/" + this.model.get("id"),
            autoSync: false
          });

          this.ThumbnailFbModel = new this.ThumbnailFbModelRef();
          this.ThumbnailFbModel.on('sync', this.thumbnailSynced);
          this.ThumbnailFbModel.fetch();
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
          this.ThumbnailFbModelRef = Backbone.Firebase.Model.extend({
            url: Common.FirebaseUrl + "thumbnails/" + this.model.get("id"),
            autoSync: false
          });
          this.ThumbnailFbModel = new this.ThumbnailFbModelRef();
          this.ThumbnailFbModel.save({
            imageData: Common.DefaultThumbnailImage,
            isThumbnail: true
          });

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
            self.ThumbnailFbModel.save({
              isThumbnail: true,
              imageData: reader.result
            });
          } else {
            self.ImageFbModels.set(Common.getGuid(), reader.result);
            self.ImageFbModels.save();
          }
        };

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
          this.ThumbnailFbModel.save({
            imageData: Common.DefaultThumbnailImage
          });
        } else if (parseInt(imageIndex) >= 0 && parseInt(imageIndex) <= 9) {
          this.ImageFbModels.unset(imageKey);
          this.ImageFbModels.save();
          this.ImageViews[imageIndex].remove(); //remove the view from the DOM
          this.ImageViews.remove(imageIndex);   //remove the view from the collection
          this.ImageViewModels.remove(imageIndex);  //remove the model from the collection
          //reset indexes on remaining images
          _.each(this.ImageViewModels, function(imageModel, i) {
            imageModel.set({ imageIndex: i });
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
        if (this.ImageFbModelRef === undefined) {
          this.ImageFbModelRef = Backbone.Firebase.Model.extend({
            url: Common.FirebaseUrl + "images/" + this.model.get("id"),
            autoSync: false
          });

          this.ImageFbModels = new this.ImageFbModelRef();
          this.ImageFbModels.on('sync', $.proxy(this.imagesSynced, this));
          this.ImageFbModels.fetch();
        }
      },

      imagesSynced: function(imagesModel) {
        //TODO: how would this behave if 10 people were adding to the Model?
        var self = this;

        //create an ImageModel and ImageView for each image and push it onto a collection
        _.each(imagesModel.keys(), function(key) {
          if (self.$("#" + key).length === 0 && imagesModel.get(key) !== null) {
            //create DOM element to attach to
            $('<div id="' + key + '"></div>').appendTo("#imageList");

            //create ImageModel and ImageView
            var imageModel = new ImageModel({
              imageData: imagesModel.get(key),
              imageIndex: self.ImageViewModels.length,
              imageKey: key
            });
            var imageView = new ImageView({
              model: imageModel,
              el: "#" + key
            });
            imageView.render();
            self.ImageViews.push(imageView);
            self.ImageViewModels.push(imageModel);
          }
        });
      },

      thumbnailSynced: function(thumbnailModel) {
        //load ImageView for thumbnail image
        this.thumbnailImageView = new ImageView({
          model: thumbnailModel,
          el: "#thumbnailImage"
        });

        this.thumbnailImageView.render();
      },

      deleteProductWarning: function(e) {
        this.$("#productWarningThumbnail").prop("src", this.$("#imageViewImage").prop("src"));
      },

      deleteProduct: function(e) {
        var self = this;

        self.isDeleting = true;

        //remove bracelet, thumbnail, and images from firebase
        Bracelets.remove(self.model.attributes);
        var thumbnailRef = new Firebase(Common.FirebaseUrl + "thumbnails/" + self.model.get("id"));
        var imagesRef = new Firebase(Common.FirebaseUrl + "images/" + self.model.get("id"));
        thumbnailRef.remove();
        imagesRef.remove();

        //don't redirect to the #/list page until after the modal is done hiding.
        //this fixes issue of page becoming unresponsive after redirecting from modal
        this.$("#warningProductModal").on("hidden.bs.modal", function(e) {
          window.location.hash = "#/list";
        });

        this.$("#warningProductModal").modal('hide');
      }
    });

    return BraceletView;
  }
);
