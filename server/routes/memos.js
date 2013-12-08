'use strict';

var fs = require('fs');

var MEMO_DIR = './memos/';
var MEMO_DIR_FOR_PRIVATE = 'private/';
var memos = null;

function getMemos (dir) {
  var files = [];
  var dirs = [];

  dir = dir || '';

  var fileNames = fs.readdirSync(MEMO_DIR + dir);
  var length = fileNames.length;
  for (var i = 0; i < length; i++) {
    var fileName = fileNames[i];
    // Check if the file is not a hidden file
    if (fileName.charAt(0) !== '.') {
      var stat = fs.statSync(MEMO_DIR + dir + fileName);
      if (stat.isFile()) {
        files.push(/* dir + */ fileName);
      } else if (stat.isDirectory()) {
        var subDir = {
          dirName: /* dir + */ fileName
          // children: getMemos(dir + fileName + '/')
        };
        dirs.push(subDir);
      }
    }
  }

  return dirs.concat(files);
}

function initialize () {
  memos = getMemos();
  // memos = memos.concat(getMemos(MEMO_DIR_FOR_PRIVATE));
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

    socket.on('save', function (data) {
      // console.log('Saving');
      // console.log(data.id);
      // console.log(data.memo);

      fs.writeFile(MEMO_DIR + data.id, data.memo.content, function (err) {
        if (err) throw err;
        // console.log('Saved');
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

exports.list = function(req, res) {
  var dir = req.params + '/';
  // console.log(dir);

  res.send(getMemos(dir));
};
