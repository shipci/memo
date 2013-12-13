/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemoCtrl', function ($scope, $routeParams, memoService) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.file = $routeParams.file + '.md';
    // console.log($scope.file);

    var index = $scope.file.lastIndexOf('/');
    if (index !== -1) {
      $scope.dir = $scope.file.substr(0, index);
      // console.log($scope.dir);
    }

    $scope.memo = null;

    memoService.watch($scope.file);

    memoService.load($scope.file, function (memo) {
      // console.log(memo);
      $scope.memo = memo;
      $scope.$apply();
    });
  });

