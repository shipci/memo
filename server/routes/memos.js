'use strict';

var fs = require('fs');

var MEMO_DIR = './memos/';
var memos = null;

function getMemos (dir) {
  var result = [];

  var files = fs.readdirSync(dir);
  var length = files.length;
  for (var i = 0; i < length; i++) {
    var file = files[i];
    var stat = fs.statSync(dir + file);
    if (stat.isFile()) {
      result.push(file);
    }
  }

  return result;
}

function initialize () {
  memos = getMemos(MEMO_DIR);
  // console.log(memos);
}

initialize();

exports.start = function (io) {
  io.sockets.on('connection', function (socket) {
    var watcher = null;

    socket.on('watch', function (id) {
      // console.log('Watching ' + id);
      socket.set('id', id, function () {
        startWatching(MEMO_DIR + id);
        sendMemo();
      });
    });

    socket.on('disconnect', function () {
      // console.log('Disconnected');
      stopWatching();
    });

    function startWatching (fileName) {
      watcher = fs.watch(fileName, {persistent: false}, function () {
        // console.log('Detected: ' + fileName);
        sendMemo();

        stopWatching();
        startWatching(fileName);
      });
    }

    function stopWatching () {
      if (watcher) {
        watcher.close();
      }
      watcher = null;
    }

    function sendMemo () {
      // console.log('Sending');
      socket.get('id', function (err, id) {
        // console.log('Loading ' + id);
        fs.readFile(MEMO_DIR + id, function (err, data) {
          socket.emit('memo', {
            title: 'Title',
            content: data.toString()
          });
        });
      });
    }
  });
};

exports.list = function(req, res){
  res.send(memos);
};
