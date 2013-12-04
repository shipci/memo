'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $http) {
    $scope.memos = [];

    $http.get('/memos').success(function (data) {
      $scope.memos = data;
    });
  });
