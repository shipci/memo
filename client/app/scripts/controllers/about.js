/* global $ */

'use strict';

angular.module('memoApp')
  .controller('AboutCtrl', function ($rootScope) {
    $rootScope.title = 'memo | About';

    $('.nav li').removeClass('active');
    $('#nav-about').addClass('active');
  });
