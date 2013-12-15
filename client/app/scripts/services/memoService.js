/* global io */

'use strict';

angular.module('memoApp')
  .service('memoService', function memoService() {
    this.socket = io.connect('http://localhost');

    this.watch = function (file) {
      this.socket.emit('watch', file);
    };

    this.load = function (file, callback) {
      this.socket.on('memo', function (data) {
        if (callback) {
          callback(data);
        }
      });
    };

    this.save = function (file, memo) {
      this.socket.emit('save', {
        file: file,
        memo: memo
      });
    };

    this.getDirSplit = function (dir, disableLastItem) {
      var dirSplit = [];
      var fullDir = '';

      var dirs = dir.split('/');
      var length = dirs.length;
      for (var i = 0; i < length; i++) {
        var dir = {
          name: dirs[i]
        };
        if (!disableLastItem || (i !== length - 1)) {
          dir.link = fullDir + dirs[i];
        }
        dirSplit.push(dir);
        fullDir += dirs[i] + '/';
      }

      return dirSplit;
    }
  });
