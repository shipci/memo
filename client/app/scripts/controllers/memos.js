'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $http) {
    $scope.memos = [];
    $http({method: 'GET', url: '/memos'}).
      success(function(data, status, headers, config) {
        $scope.memos = data;
      }).
      error(function(data, status, headers, config) {
      });
  });
