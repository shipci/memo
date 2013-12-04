'use strict';

angular.module('memoApp')
  .controller('MemoCtrl', function ($scope, $routeParams, memoService) {
    var id = $routeParams.id;
    // console.log(id);
    $scope.memo = null;

    memoService.watchMemo(id);

    memoService.getMemo(id, function (memo) {
      // console.log(memo);
      $scope.memo = memo;
      $scope.$apply();
    });
  });

