'use strict';

angular.module('memoApp')
  .controller('MemoCtrl', function ($scope, $routeParams) {
    var id = $routeParams.id;
    // console.log(id);
    $scope.memo = null;

    var socket = io.connect('http://localhost:9001');
    socket.on('memo', function (data) {
      // console.log(data);
      $scope.memo = data;
      $scope.$apply();
    });
  });

