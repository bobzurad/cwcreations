/*global require*/
'use strict';

// Array Remove - By John Resig (MIT Licensed)
/*
// Remove the second item from the array
array.remove(1);
// Remove the second-to-last item from the array
array.remove(-2);
// Remove the second and third items from the array
array.remove(1,2);
// Remove the last and second-to-last items from the array
array.remove(-2,-1);
*/
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// Require.js allows us to configure shortcut alias
require.config({
  baseUrl: '../../js',
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

require(
  ['backbone', 'routers/_im/router', 'bootstrap'],
  function (Backbone, Workspace) {
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()
    new Workspace();
    Backbone.history.start();
  }
);
