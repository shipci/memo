/*global Showdown */

'use strict';

angular.module('memoFilters', [])
  .filter('markdown', function ($sce) {
    var marked = window.marked;
    var hljs = window.hljs;

    marked.setOptions({
      highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, code).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });

    return function (input) {
      if (!input) {
        return null;
      }

      return $sce.trustAsHtml(marked(input));
    };
  });
