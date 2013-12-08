/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $http, $routeParams) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.dir = 'memos' + ($routeParams.dir ? '/' + $routeParams.dir : '');
    // console.log($scope.dir);

    var dirSplit = [];
    var fullDir = '';
    var dirs = $scope.dir.split('/');
    var length = dirs.length;
    for (var i = 0; i < length; i++) {
      var dir = {
        name: dirs[i]
      }
      if (i !== length - 1) {
        dir.link = fullDir + dirs[i];
      }
      dirSplit.push(dir);
      fullDir += dirs[i] + '/';
    }
    $scope.dirSplit = dirSplit;
    console.log($scope.dirSplit);

    $scope.memos = [];

    $http.get($scope.dir).success(function (data) {
      $scope.memos = data;
    });
  });
