'use strict';

var fs = require('fs');

var MEMO_DIR = './memos/';

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
        files.push({
          type: 'file',
          name: fileName
        });
      } else if (stat.isDirectory()) {
        dirs.push({
          type: 'dir',
          name: fileName
        });
      }
    }
  }

  return dirs.concat(files);
}

var watcher = null;

function startWatching (socket, fileName) {
  stopWatching();

  // console.log('Watching: ' + fileName);
  watcher = fs.watch(fileName, {persistent: true}, function () {
    // console.log('Detected: ' + fileName);
    sendMemo(socket);

    startWatching(socket, fileName);
  });
  // console.log(watcher);
}

function stopWatching () {
  if (watcher) {
    // console.log('Unwatched: ');
    watcher.close();
  }
  watcher = null;
}

function sendMemo (socket) {
  // console.log('Sending');
  socket.get('file', function (err, file) {
    // console.log('Loading ' + file);
    fs.readFile(MEMO_DIR + file, function (err, data) {
      socket.emit('memo', {
        title: 'Title',
        content: data.toString()
      });
    });
  });
}

exports.start = function (io) {
  io.sockets.on('connection', function (socket) {
    // console.log('Connected');
    socket.on('watch', function (file) {
      // console.log('Watching ' + file);
      socket.set('file', file, function () {
        startWatching(socket, MEMO_DIR + file);
        sendMemo(socket);
      });
    });

    socket.on('save', function (data) {
      // console.log('Saving');
      // console.log(data.file);
      // console.log(data.memo);

      fs.writeFile(MEMO_DIR + data.file, data.memo.content, function (err) {
        if (err) {
          throw err;
        }
        // console.log('Saved');
      });
    });

    socket.on('disconnect', function () {
      // console.log('Disconnected');
      stopWatching();
    });
  });
};

exports.list = function(req, res) {
  var dir = req.params + '/';
  // console.log(dir);

  res.send(getMemos(dir));
};
