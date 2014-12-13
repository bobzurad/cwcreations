define(
  ['jquery','underscore', 'backbone', 'text!templates/login.html'],
  function ($, _, Backbone, loginTemplate) {
    'use strict';

    var LoginView = Backbone.View.extend({
      el: '#loginContainer',

      template: _.template(loginTemplate),

      events: {
        "click #googleLogin": "authWithGoogle",
        "click #facebookLogin": "authWithFacebook"
      },

      render: function() {
        this.$el.html(this.template());

        return this;
      },

      removeTemplate: function() {
        this.$el.children().remove();
      },

      authWithGoogle: function() {
        this._login("google");
      },

      authWithFacebook: function() {
        this._login("facebook");
      },

      _login: function(provider) {
        this.model.firebase.authWithOAuthPopup(provider, function(error, authData) {
          if (error) {
            $("#error").html(error.message);
          } else {
            window.location.hash = "#/list";  //we don't have access to router here, so can't call .navigate()
          }
        });
      }

    });

    return LoginView;
  }
);
