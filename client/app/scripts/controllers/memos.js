/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $http, $routeParams) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.dir = 'memos' + ($routeParams.dir ? '/' + $routeParams.dir : '');
    // console.log($scope.dir);

    $scope.memos = [];

    $http.get($scope.dir).success(function (data) {
      $scope.memos = data;
    });
  });
