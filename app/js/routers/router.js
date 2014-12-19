define(
  ['jquery', 'backbone',
  'models/rootRef', 'models/bracelet',
  'collections/bracelets',
  'views/list'
  ],
  function($, Backbone, RootRef, Bracelet, Bracelets, ListView) {
    'use strict';

    var Workspace = Backbone.Router.extend({
      routes: {
        "*path": "defaultRoute"
      },
      initialize: function() {
        //this function runs on every page load
        this.ListView = new ListView({ collection: Bracelets });
      },
      defaultRoute: function() {
        this.showList();
      },
      showList: function() {
        this.ListView.render();
      }
    });

    return Workspace;
  }
)
