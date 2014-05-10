/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $rootScope, $http, $routeParams, memoService) {
    $scope.localDir = 'file:///Users/eqo/src/nodejs/memo';
    $scope.hostDir = '';
    var types = {
      markdown: ['md'],
      book: ['pdf'],
      image: ['jpg', 'gif', 'png'],
      ms: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
    };

    $('.nav li').removeClass('active');
    $('#nav-memos').addClass('active');

    $scope.dir = 'memos' + ($routeParams.dir ? '/' + $routeParams.dir : '');
    $scope.dirSplit = memoService.getDirSplit($scope.dir, true);

    $rootScope.title = $scope.dir;

    $scope.memos = [];

    function readMemos (memos) {
      for (var i = 0, l = memos.length; i < l; i++) {
        var memo = memos[i];

        if (memo.hidden) {
          continue;
        }

        var ext = memo.name.split('.').pop();
        for (var type in types) {
          if (types[type].indexOf(ext) !== -1) {
            memo.type = type;
          }
        }

        $scope.memos.push(memo);
      }
    }

    $http.get($scope.dir).success(readMemos);

    var readmeFile = $routeParams.dir + '/README.md';
    memoService.watch(readmeFile);
    memoService.load(readmeFile, function (memo) {
      $scope.memo = memo;
      $scope.$apply();
    });

    $('.modal').on('shown.bs.modal', function () {
      $(this).find('input').focus().select();
    });

    $('.modal').keypress(function (e) {
      if (e.charCode === 13) {
        var isDir = $(e.target).attr('id') === 'dirName';
        $scope.create(isDir);
      }
    });

    $scope.create = function (isDir) {
      var name = isDir ? $scope.dirName + '/' : $scope.memoName;

      if (name) {
        $http.post($scope.dir + '/' + name).success(readMemos);
      }

      $('.modal').modal('hide');
    };

    $scope.menu = function () {
      $scope.name = this.memo.name;
      $('#name').val($scope.name);
      $('#rename').modal('show');
    };

    $scope.rename = function () {
      $http.put($scope.dir + '/' + $scope.name + '?new=' + $scope.newName).success(readMemos);

      $('#rename').modal('hide');
    };

    $scope.delete = function () {
      $http.delete($scope.dir + '/' + $scope.name).success(readMemos);

      $('#rename').modal('hide');
    };
  })
  .directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {$event:event});
        });
      });
    };
  });
