/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemoEditCtrl', function ($scope, $routeParams, memoService) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    var height = (window.innerHeight - $('#md_area').offset().top - 100) + 'px';
    // console.log(height);
    $('#md_area').height(height);
    $('#html_area').height(height);

    $scope.file = $routeParams.file + '.md';
    // console.log($scope.file);

    var file = 'memos/' + $scope.file;
    var index = file.lastIndexOf('/');
    if (index !== -1) {
      $scope.dir = file.substr(0, index);
      $scope.dirSplit = memoService.getDirSplit($scope.dir);
    }

    $scope.memo = null;

    memoService.watch($scope.file);

    memoService.load($scope.file, function (memo) {
      // console.log(memo);
      $scope.memo = memo;
      $scope.$apply();
    });

    $('#save').click(function () {
      // console.log('Save');
      memoService.save($scope.file, $scope.memo);
    });
  });

