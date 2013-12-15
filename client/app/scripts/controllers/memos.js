/* global $ */

'use strict';

angular.module('memoApp')
  .controller('MemosCtrl', function ($scope, $http, $routeParams, memoService) {
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
