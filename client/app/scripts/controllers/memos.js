'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $http) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.memos = [];

    $http.get('/memos').success(function (data) {
      $scope.memos = data;
    });
  });
