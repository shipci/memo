/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $http, $routeParams) {
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
    // console.log($scope.dir);

    var dirSplit = [];
    var fullDir = '';
    var dirs = $scope.dir.split('/');
    var length = dirs.length;
    for (var i = 0; i < length; i++) {
      var dir = {
        name: dirs[i]
      };
      if (i !== length - 1) {
        dir.link = fullDir + dirs[i];
      }
      dirSplit.push(dir);
      fullDir += dirs[i] + '/';
    }
    $scope.dirSplit = dirSplit;

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
  });
