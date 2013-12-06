'use strict';

angular.module('memoApp')
  .controller('AboutCtrl', function ($scope) {
    $('.nav li').removeClass('active');
    $('#nav-about').addClass('active');
  });
