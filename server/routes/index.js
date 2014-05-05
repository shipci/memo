'use strict';

exports.index = function(req, res){
  var publicPath = require('path').join(__dirname, '../public/');
  res.sendfile(publicPath + 'index.html');
};
