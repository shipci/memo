/*global Showdown */

'use strict';

angular.module('memoFilters', [])
  .filter('markdown', function () {
    // var converter = new Showdown.converter({ extensions: ['github'] });
    var converter = new Showdown.converter();
    return function (input) {
      if (!input) {
        return null;
      }

      // console.log(input);
      return converter.makeHtml(input);
    };
  });
