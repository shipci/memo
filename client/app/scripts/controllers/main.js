/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MainCtrl', function () {
    $('.nav li').removeClass('active');
    $('#nav-home').addClass('active');
  });
