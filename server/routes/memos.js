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
      var exists = fs.existsSync(MEMO_DIR + dir + fileName);
      if (exists) {
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
  }

  return dirs.concat(files);
}

exports.create = function (req, res) {
  var path = req.params[0];

  var isDir = false;
  if (path.charAt(path.length - 1) === '/') {
    isDir = true;
    path = path.slice(0, -1);
  }

  fs.exists(MEMO_DIR + path, function (exists) {
    if (!exists) {
      if (isDir) {
        fs.mkdirSync(MEMO_DIR + path);
      } else {
        var fd = fs.openSync(MEMO_DIR + path, 'w+');
        fs.closeSync(fd);
      }
    } else {
      // console.log('already exists: ' + MEMO_DIR + path);
    }
  });

  res.send();
}

function startWatching (watcher, socket, fileName) {
  stopWatching(watcher);

  // console.log('Watching: ' + fileName);
  watcher = fs.watch(fileName, {persistent: true}, function () {
    // console.log('Detected: ' + fileName);
    sendMemo(socket);

    startWatching(watcher, socket, fileName);
  });
  // console.log(watcher);
}

function stopWatching (watcher) {
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
      if (data) {
        socket.emit('memo', {
          title: 'Title',
          content: data.toString()
        });
      }
    });
  });
}

exports.start = function (io) {
  io.sockets.on('connection', function (socket) {
    var watcher = null;

    // console.log('Connected');
    socket.on('watch', function (file) {
      // console.log('Watching ' + file);
      socket.set('file', file, function () {
        startWatching(watcher, socket, MEMO_DIR + file);
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

exports.get = function(req, res) {
  var file = req.params;
  // console.log(file);

  res.sendfile(file);
};
