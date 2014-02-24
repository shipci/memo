/*global Showdown */

'use strict';

angular.module('memoFilters', [])
  .filter('markdown', function ($sce) {
    // var converter = new Showdown.converter({ extensions: ['github', 'youtube'] });
    var marked = window.marked;
    var hljs = window.hljs;

    marked.setOptions({
      highlight: function (code, lang) {
        return hljs.highlight(lang, code).value;
      }
    });

    return function (input) {
      if (!input) {
        return null;
      }

      // console.log(input);
      // return $sce.trustAsHtml(converter.makeHtml(input));
      return $sce.trustAsHtml(marked(input));
    };
  });
