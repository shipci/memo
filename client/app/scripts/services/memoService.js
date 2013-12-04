/* global io */

'use strict';

angular.module('memoApp')
  .service('memoService', function memoService() {
    this.socket = io.connect('http://localhost');

    this.watchMemo = function (id) {
      this.socket.emit('watch', id);
    };

    this.getMemo = function (id, callback) {
      this.socket.on('memo', function (data) {
        if (callback) {
          callback(data);
        }
      });
    };
  });
