var MEMO_DIR = './memos/';
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

var memos = getMemos(MEMO_DIR);
console.log(memos);

exports.list = function(req, res){
  // res.send("respond with a resource");
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
      result.push(dir + file);
    } else if (stat.isDirectory()) {
      result = result.concat(getMemos(dir + file + '/'));
    }
  }

  return result;
}
