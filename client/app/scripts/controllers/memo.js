/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemoCtrl', function ($scope, $rootScope, $routeParams, memoService) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.file = $routeParams.file + '.md';
    // console.log($scope.file);

    var file = 'memos/' + $scope.file;
    var index = file.lastIndexOf('/');
    if (index !== -1) {
      $scope.dir = file.substr(0, index);
    }
    $scope.dirSplit = memoService.getDirSplit(file, true);

    $rootScope.title = $scope.dirSplit[$scope.dirSplit.length - 1].name;

    $scope.memo = null;

    memoService.watch($scope.file);

    memoService.load($scope.file, function (memo) {
      // console.log(memo);
      $scope.memo = memo;
      $scope.$apply();
    });
  });

