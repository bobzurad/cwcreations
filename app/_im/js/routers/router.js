define(
  ['jquery', 'backbone', 'models/rootRef', 'views/login', 'views/list'],
  function($, Backbone, RootRef, LoginView, ListView) {
    'use strict';

    var Workspace = Backbone.Router.extend({
      routes: {
        "list": "showList",
        "login": "showLogin",
        "*path": "defaultRoute"
      },
      defaultRoute: function() {
        if (RootRef.firebase.getAuth() === null) {
          window.location.hash = "#login";
        } else {
          window.location.hash = "#list";
        }
      },
      showLogin: function() {
        var view = new LoginView({ model: RootRef });
        view.render();
      },
      showList: function() {
        if (RootRef.firebase.getAuth() === null) {
          window.location.hash = "#login";
        }
      }
    });

    return Workspace;
  }
)
