'use strict';

angular.module('memoApp')
  .controller('MemoCtrl', function ($scope, $routeParams, memoService) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.id = $routeParams.id + '.md';
    // console.log($scope.id);
    $scope.memo = null;

    memoService.watch($scope.id);

    memoService.load($scope.id, function (memo) {
      // console.log(memo);
      $scope.memo = memo;
      $scope.$apply();
    });
  });

