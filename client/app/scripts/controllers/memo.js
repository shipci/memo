/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemoCtrl', function ($scope, $rootScope, $http, $routeParams, memoService) {
    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.file = $routeParams.file + '.md';
    // console.log($scope.file);

    var file = 'memos/' + $scope.file;
    var index = file.lastIndexOf('/');
    if (index !== -1) {
      $scope.dir = file.substr(0, index);
    }
    $scope.dirSplit = memoService.getDirSplit(file, true);

    $rootScope.title = $scope.dirSplit[$scope.dirSplit.length - 1].name;

    $scope.memo = null;

    memoService.watch($scope.file);

    memoService.load($scope.file, function (memo) {
      // console.log(memo);
      $scope.memo = memo;
      $scope.$apply();
    });

    $('.modal').on('show.bs.modal', function () {
      // Get the first line in the content as a candidate of content's title
      var content = $scope.memo.content;
      var contentLines = content.split('\n');
      var title = '';
      for (var i = 0; i < contentLines.length; i++) {
        if (contentLines[i]) {
          title = contentLines[i];
          break;
        }
      }

      // Remove '#' and spaces
      title = title.replace(/#+\s*/, '');
      // console.log(title);

      // Get title if it is link
      if (title.match(/\[(.+)\]\(.+\)/)) {
        title = RegExp.$1;
      }

      $scope.memoTitle = title;
      $scope.$apply();
    });

    $('.modal').on('shown.bs.modal', function () {
      $(this).find('input').focus().select();
    });

    $scope.publish = function () {
      // console.log('publish');

      $http.post('/rss/' + $scope.file + '?t=' + $scope.memoTitle);

      $('.modal').modal('hide');
    };
  });

