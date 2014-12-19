define(
  ['jquery','underscore', 'backbone', 'text!templates/_im/login.html'],
  function ($, _, Backbone, loginTemplate) {
    'use strict';

    var LoginView = Backbone.View.extend({
      el: '#loginContainer',

      template: _.template(loginTemplate),

      events: {
        "click #passwordLogin": 'authWithPassword',
        "keypress .form-control": 'authOnEnter'
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

      authOnEnter: function(e) {
        if (e.keyCode === 13) { //13 is enter key
          this.authWithPassword();
        }
      },

      authWithPassword: function() {
        this.model.firebase.authWithPassword({
          email: this.$email.val(),
          password: this.$password.val()
        }, function(error, authData) {
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
