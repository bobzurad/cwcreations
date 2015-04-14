define([], function () {
  'use strict';
  return {
    FirebaseUrl: 'https://cwcreations.firebaseio.com/',
    DefaultThumbnailImage: 'http://placehold.it/360x320',

    //constants for key presses
    ENTER_KEY: 13,
    ESCAPE_KEY: 27,

    getGuid: function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  };
});
