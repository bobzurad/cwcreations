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
    jquery: '../../libs/jquery',
    underscore: '../../libs/underscore',
    backbone: '../../libs/backbone',
    text: '../../libs/requirejs/text',
    firebase: '../../libs/firebase-debug',
    backbonefire: '../../libs/backbonefire',
    bootstrap: '../../libs/bootstrap/js/bootstrap'
  }
});

define('firebaseConfig', {
  url: 'https://cwcreations.firebaseio.com/'
});

require(
  ['backbone', 'routers/router', 'bootstrap'],
  function (Backbone, Workspace) {
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()
    new Workspace();
    Backbone.history.start();
  }
);
