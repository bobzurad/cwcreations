/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
      'underscore',
      'jquery'
      ],
      exports: 'Backbone'
    }
  },
  paths: {
    jquery: '../../libs/jquery',
    underscore: '../../libs/underscore',
    backbone: '../../libs/backbone',
    text: '../../libs/requirejs/text',
    firebase: '../../libs/firebase',
    backbonefire: '../../libs/backbonefire'
  }
});

require([
  'backbone',
  'views/app',
  'collections/todos'
  ], function (Backbone, AppView, Workspace, Todos) {
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()
    new Workspace();
    Backbone.history.start();
    // Initialize the application view
    new AppView({ collection: Todos });
  });
