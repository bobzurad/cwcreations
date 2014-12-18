define(
  ['jquery','underscore', 'backbone', 'text!templates/login.html'],
  function ($, _, Backbone, loginTemplate) {
    'use strict';

    var LoginView = Backbone.View.extend({
      el: '#loginContainer',

      template: _.template(loginTemplate),

      events: {
        "click #googleLogin": "authWithGoogle",
        "click #facebookLogin": "authWithFacebook",
        "click #passwordLogin": 'authWithPassword'
      },

      render: function() {
        this.$el.html(this.template());

        this.$email = this.$("#inputEmail");
        this.$password = this.$("#inputPassword");

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

      authWithPassword: function() {
        this._login('password');
      },

      _login: function(provider) {
        var self = this;

        if (provider === 'password') {
          //email & password auth
          this.model.firebase.authWithPassword({
            email: this.$email.val(),
            password: this.$password.val()
          }, function(error, authData) {
            self._loginCallback(error, authData);
          })
        } else {
          //google & facebook auth
          this.model.firebase.authWithOAuthPopup(provider, function(error, authData) {
            self._loginCallback(error, authData);
          });
        }
      },

      _loginCallback: function(error, authData) {
        if (error) {
          $("#error").html(error.message);
        } else {
          window.location.hash = "#/list";  //we don't have access to router here, so can't call .navigate()
        }
      }

    });

    return LoginView;
  }
);
