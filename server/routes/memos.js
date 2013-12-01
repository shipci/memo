var MEMO_FILE = './memos/memo0.md';

var fs = require('fs');

var io = require('socket.io').listen(9001);
io.sockets.on('connection', function (socket) {
  startWatching(MEMO_FILE);
  sendMemo();

  function startWatching (fileName) {
    var watcher = fs.watch(fileName, {persistent: false}, function (event, name) {
      console.log(fileName);

      sendMemo();

      watcher.close();
      startWatching(fileName);
    });
  }

  function sendMemo () {
    fs.readFile(MEMO_FILE, function (err, data) {
      socket.emit('memo', {
        title: 'Title',
        content: data.toString()
      });
    });
  }
});

exports.list = function(req, res){
  res.send("respond with a resource");
};
