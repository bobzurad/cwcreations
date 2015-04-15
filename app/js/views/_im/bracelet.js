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
        console.log("braceletView render")
        //load model and render template
        this.Images = undefined;
        if (id && Bracelets.models.length > 0) {
          //for edit
          this.model = Bracelets.get(id);
          this.$el.html(this.template({ model: this.model.attributes }));
          this.$(".photoArea").show();
          this.$('a[data-toggle="tab"]').parent().removeClass("disabled");
        } else {
          //for create
          this.model = new Bracelet({
            thumbnail: Common.DefaultThumbnailImage
          });
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

        //load ImageView for thumbnail image
        var imageModel = new ImageModel({
          imageData: this.model.get("thumbnail"),
          isThumbnail: true
        });
        this.thumbnailImageView = new ImageView({
          model: imageModel.attributes,
          el: "#thumbnailImage"
        });
        this.thumbnailImageView.render();

        //events
        this.listenTo(this.model, 'invalid', this.showErrors);
        this.$thumbnailUpload.on("change", $.proxy(this.readImage, this));
        this.$imageUpload.on("change", $.proxy(this.readImage, this));

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
        var isThumbnail = e.currentTarget.getAttribute("id") == "thumbnailUpload";

        reader.onload = function(e) {
          if (isThumbnail) {
            self.model.set({
              thumbnail: reader.result
            });
          } else {
            self.Images.set(Common.getGuid(), reader.result);
            self.Images.save();
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
          this.model.set({
            thumbnail: Common.DefaultThumbnailImage
          });
        } else if (parseInt(imageIndex) >= 0 && parseInt(imageIndex) <= 9) {
          this.Images.unset(imageKey);
          this.Images.save();
          this.ImageViews[imageIndex].remove();
          this.ImageViews.remove(imageIndex);
          this.$("#warningModal").hide();
        }
      },

      tabClicked: function(e) {
        //don't switch to tab if it's disabled
        if ($(e.currentTarget).parent().hasClass("disabled")) {
          e.preventDefault();
          return false;
        }
      },

      loadImages: function(e) {
        console.log("loadImages");
        //TODO: rename this.Images to this.ImageModel as it's a model, not a collection
        if (this.Images === undefined) {
          this.ImagesRef = Backbone.Firebase.Model.extend({
            url: Common.FirebaseUrl + "images/" + this.model.get("id"),
            autoSync: false
          });

          this.Images = new this.ImagesRef();
          this.Images.on('sync', $.proxy(this.imagesSynced, this));
          this.Images.fetch();
        }
      },

      imagesSynced: function(imagesModel) {
        console.log("imagesSynced");
        //TODO: how would this behave if 10 people were adding to the Model?
        var self = this;

        if (self.ImageViews === undefined) {
          self.ImageViews = [];
        }

        //create an ImageModel and ImageView for each image and push it onto a collection
        _.each(imagesModel.keys(), function(key, i) {
          if ($("img[data-imagekey=" + key + "]").length === 0) {
            //create DOM element to attach to
            $('<div id="image' + i + '"></div>').appendTo("#images");

            //create ImageModel and ImageView
            if (imagesModel.get(key) !== null) {
              var imageModel = new ImageModel({
                imageData: imagesModel.get(key),
                imageIndex: i,
                imageKey: key
              });
              var imageView = new ImageView({
                model: imageModel.attributes,
                el: "#image" + i
              });
              imageView.render();
              self.ImageViews.push(imageView);
            }
          }
        });
      },

      deleteProduct: function(e) {
        Bracelets.remove(this.model.attributes);
        window.location.hash = "#/list";
      }
    });

    return BraceletView;
  }
);
