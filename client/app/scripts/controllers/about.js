/* global $ */

'use strict';

angular.module('memoApp')
  .controller('AboutCtrl', function () {
    $('.nav li').removeClass('active');
    $('#nav-about').addClass('active');
  });
