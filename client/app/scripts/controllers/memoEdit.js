'use strict';

angular.module('memoApp')
  .controller('MemoEditCtrl', function ($scope, $routeParams, memoService) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    var height = (window.innerHeight - $('#md_area').offset().top - 100) + 'px';
    // console.log(height);
    $('#md_area').height(height);
    $('#html_area').height(height);

    $scope.id = $routeParams.id;
    // console.log($scope.id);
    $scope.memo = null;

    memoService.watch($scope.id);

    memoService.load($scope.id, function (memo) {
      // console.log(memo);
      $scope.memo = memo;
      $scope.$apply();
    });

    $('#save').click(function () {
      // console.log('Save');
      memoService.save($scope.id, $scope.memo);
    });
  });

