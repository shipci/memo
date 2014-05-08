'use strict';

var watch = require('express').Router();

var fs = require('fs');
var path = require('path');
var memoConfig = require('../config').memoConfig;

var enableWatch = process.env.WATCH && process.env.WATCH === 'true';
var watchType = process.env._system_name === 'OSX';

watch.start = function (server) {
  var io = require('socket.io').listen(server, {'log level': 0});
  io.sockets.on('connection', function (socket) {
    var watcher = null;

    socket.on('watch', function (file) {
      socket.set('file', file, function () {
        startWatching(watcher, socket, path.join(memoConfig.dir, file));
        sendMemo(socket);
      });
    });

    socket.on('save', function (data) {
      fs.writeFile(path.join(memoConfig.dir, data.file), data.memo.content, function (err) {
        if (err) {
          throw err;
        }
      });
    });

    socket.on('disconnect', function () {
      stopWatching(watcher);
    });
  });
};

function startWatching (watcher, socket, fileName) {
  if (!enableWatch) {
    return;
  }

  stopWatching(watcher);

  if (!fs.existsSync(fileName)) {
    return;
  }

  if (watchType) {
    try {
      watcher = fs.watch(fileName, {persistent: true}, function () {
        sendMemo(socket);
        startWatching(watcher, socket, fileName);
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    fs.watchFile(fileName, {persistent: true, interval: 1000}, function () {
      sendMemo(socket);
    });
    watcher = fileName;
  }
}

function stopWatching (watcher) {
  if (watcher) {
    if (watchType) {
      watcher.close();
    } else {
      fs.unwatchFile(watcher);
    }

    watcher = null;
  }
}

function sendMemo (socket) {
  socket.get('file', function (err, file) {
    fs.readFile(path.join(memoConfig.dir, file), function (err, data) {
      if (data) {
        socket.emit('memo', {
          title: 'Title',
          content: data.toString()
        });
      }
    });
  });
}

watch.get(/^(.*)$/, function (req, res) {
  var file = req.params[0];
  console.log(file);

  res.send();
});


module.exports.watch = watch;
