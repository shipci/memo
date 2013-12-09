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
  });
