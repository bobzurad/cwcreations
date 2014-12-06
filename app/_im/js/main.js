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
    firebase: '../../libs/firebase',
    backbonefire: '../../libs/backbonefire',
    bootstrap: '../../libs/bootstrap/js/bootstrap'
  }
});

require(
  ['backbone', 'views/list','views/login', 'collections/bracelets', 'bootstrap'],
  function (Backbone, ListView, LoginView, Bracelets) {
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()
    //new Workspace();
    Backbone.history.start();

    if (Bracelets.firebase.getAuth() === null) {
      new LoginView().$el.show();
    } else {
      new ListView().$el.show();
    }
  }
);
