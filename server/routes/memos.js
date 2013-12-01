
var fs = require('fs');
var read = fs.createReadStream('./memos/memo0.md');

var io = require('socket.io').listen(9001);
io.sockets.on('connection', function (socket) {
  read.on('data', function (data) {
    var content = data.toString();

    socket.emit('memo', {
      title: 'Title',
      content: content
    });
  });
});

exports.list = function(req, res){
  res.send("respond with a resource");
};
