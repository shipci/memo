/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MainCtrl', function ($rootScope) {
    $rootScope.title = 'memo';

    $('.nav li').removeClass('active');
    $('#nav-home').addClass('active');
  });
