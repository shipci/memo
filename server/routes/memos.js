var MEMO_FILE = './memos/memo0.md';

var fs = require('fs');
var read = fs.createReadStream(MEMO_FILE);

var io = require('socket.io').listen(9001);
io.sockets.on('connection', function (socket) {
  read.on('data', function (data) {
    startWatching(MEMO_FILE);

    var content = data.toString();
    sendMemo(content);

    function startWatching (fileName) {
      var watcher = fs.watch(fileName, {persistent: true}, function (event, filename) {
        content = fs.readFileSync(MEMO_FILE).toString();
        sendMemo(content);

        watcher.close();
        startWatching(fileName);
      });
    }

    function sendMemo (content) {
      socket.emit('memo', {
        title: 'Title',
        content: content
      });
    }
  });
});

exports.list = function(req, res){
  res.send("respond with a resource");
};
