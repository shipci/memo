var MEMO_DIR = './memos/';
var MEMO_FILE = './memos/memo0.md';

var fs = require('fs');

var io = require('socket.io').listen(9001);
io.sockets.on('connection', function (socket) {
  socket.on('watch', function (id) {
    // console.log('Watching ' + id);
    socket.set('id', id, function () {
      startWatching(MEMO_DIR + id);
      sendMemo();
    });
  });

  function startWatching (fileName) {
    var watcher = fs.watch(fileName, {persistent: false}, function (event, name) {
      // console.log(fileName);
      sendMemo();

      watcher.close();
      startWatching(fileName);
    });
  }

  function sendMemo () {
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

var memos = getMemos(MEMO_DIR);
// console.log(memos);

exports.list = function(req, res){
  res.send(memos);
};

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
