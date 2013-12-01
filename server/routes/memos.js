
var io = require('socket.io').listen(9001);
io.sockets.on('connection', function (socket) {
  socket.emit('memo', {
    title: 'Title',
    content: 'Content'
  });
});

exports.list = function(req, res){
  res.send("respond with a resource");
};
