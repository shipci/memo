/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $rootScope, $http, $routeParams, memoService) {
    $scope.localDir = 'file:///Users/eqo/src/nodejs/memo';
    $scope.hostDir = '/files';
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

    $http.get($scope.dir).success(function (memos) {
      var mlength = memos.length;
      for (var i = 0; i < mlength; i++) {
        for (var type in types) {
          var tlength = types[type].length;
          for (var j = 0; j < tlength; j++) {
            var t = types[type][j];
            if (memos[i].name.substr(-(t.length + 1)) === ('.' + t)) {
              memos[i].type = type;
            }
          }
        }
      }

      $scope.memos = memos;
    });

    $('.modal').on('shown.bs.modal', function (e) {
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
        $http.post($scope.dir + '/' + name).success(function () {
        });
      }

      $('.modal').modal('hide');
    };

    $scope.menu = function () {
      $scope.name = this.memo.name;
      $('#name').val($scope.name);
      $('#rename').modal('show');
    };

    $scope.rename = function (isRename) {
      var newName = isRename ? $scope.newName : '';

      $http.put($scope.dir + '/' + $scope.name + '?new=' + newName).success(function () {
      });

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
