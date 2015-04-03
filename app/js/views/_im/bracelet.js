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
        if (this.model.get("isOnSale")) {
          this.$isOnSale.prop("checked", "checked");
        }

        //load ImageView for thumbnail image
        var imageModel = new ImageModel({
          imageData: this.model.get("thumbnail")
        });
        this.thumbnailImageView = new ImageView({
          model: imageModel.attributes,
          el: "#thumbnailImage"
        });
        this.thumbnailImageView.render();

        //events
        this.listenTo(this.model, 'invalid', this.showErrors);
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
      },

      loadImages: function(e) {
        if (this.Images === undefined) {
          this.ImagesRef = Backbone.Firebase.Model.extend({
            url: Common.FirebaseUrl + "images/" + this.model.get("id"),
            autoSync: false
          });

          this.Images = new this.ImagesRef();
          this.Images.on('sync', $.proxy(this.imagesLoaded, this));
          this.Images.fetch();
        }
      },

      imagesLoaded: function(imagesModel) {
        if (imagesModel.get("image1") !== undefined) {
          //TODO: load ImageViews here
        }
      },

      deleteProduct: function(e) {
        Bracelets.remove(this.model.attributes);
        window.location.hash = "#/list";
      }
    });

    return BraceletView;
  }
);
