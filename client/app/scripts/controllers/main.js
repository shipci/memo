'use strict';

angular.module('memoApp')
  .controller('MainCtrl', function ($scope) {
    $('.nav li').removeClass('active');
    $('#nav-home').addClass('active');
  });
