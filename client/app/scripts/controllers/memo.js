'use strict';

angular.module('memoApp')
  .controller('MemoCtrl', function ($scope) {
    $scope.memos = [
      {
        title: 'Title',
        content: 'Content'
      }
    ];
  });
