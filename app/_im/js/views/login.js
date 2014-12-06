define(
  ['jquery','underscore', 'backbone', 'text!templates/login.html'],
  function ($, _, Backbone, loginTemplate) {
    'use strict';

    var LoginView = Backbone.View.extend({
      el: '#loginContainer',

      template: _.template(loginTemplate),

      events: {
        "click #googleLogin": "authWithGoogle"
      },

      render: function() {
        this.$el.html(this.template());

        //can't do this in initialize() because #error div doesn't exist in DOM until after the template is rendered
        this.$error = this.$("#error");

        return this;
      },

      authWithGoogle: function() {
        this.model.firebase.authWithOAuthPopup("google", function(error, authData) {
          if (authData === undefined) {
            //TODO: figure out why this is null
            //this.$error.text(error.code + " " + error.details + " " + error.message + " " + error.stack);
            alert(error.message);
          } else {
            window.location.hash = "#list";
          }
        });
      }

    });

    return LoginView;
  }
);
