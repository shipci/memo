'use strict';

angular.module('memoApp')
  .controller('MemoCtrl', function ($scope) {
    $scope.memos = [
      {
        title: 'Title',
        content: 'Content'
      }
    ];

    $scope.memo = null;

    var socket = io.connect('http://localhost:9001');
    socket.on('memo', function (data) {
      // console.log(data);
      $scope.memo = data;
      $scope.$apply();
    });
  });

