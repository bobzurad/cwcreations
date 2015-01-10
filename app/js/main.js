/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    underscore: { exports: '_' },
    backbone: {
      deps: [ 'underscore','jquery'],
      exports: 'Backbone'
    },
    bootstrap : { deps: ['jquery'] },
    backbonefire: {deps: ['backbone'] }
  },
  paths: {
    jquery: '../libs/jquery',
    underscore: '../libs/underscore',
    backbone: '../libs/backbone',
    text: '../libs/requirejs/text',
    firebase: '../libs/firebase-debug',
    backbonefire: '../libs/backbonefire',
    bootstrap: '../libs/bootstrap/js/bootstrap'
  }
});

require(
  ['backbone', 'routers/router', 'bootstrap'],
  function (Backbone, Workspace) {
    'use strict';
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()
    new Workspace();
    Backbone.history.start();

/*
    $(document).ready(function () {
      $("button.btnMorePhotos").off().on("click", ShowProductDetailModal);
      $("button.btnBuyNow").off().on("click", AddItemToCart);

      function ShowProductDetailModal() {
        $("#productDetailModal").modal();

        $("#productDetailModal .modal-title").text($(this).data("productname"));

        $.ajax({
          type: "GET",
          url: "/_ProductDetail",
          data: { id: $(this).data("productid") },
          success: function (data, textStatus, jqXHR) {
            $("#productDetailModal .modal-body").html(data);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
          }
        });
      };

      function AddItemToCart() {
        //Post, Redirect, Get
        $.ajax({
          type: "POST",
          url: "/api/Cart/AddToCart",
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify({ productId: $(this).data("productid") }),
          success: function (data, textStatus, jqXHR) {
            window.location = data;
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
          }
        });
      };
    });
*/
  }
);
