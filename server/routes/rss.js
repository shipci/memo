'use strict';

var express = require('express');
var rss = express.Router();

var Rss = require('rss');
var fs = require('fs');
var path = require('path');
var marked = require('marked');

var memoConfig = require('../config').memoConfig;
var rssConfig = require('../config').rssConfig;

var memoDir = path.join(__dirname, '../..', memoConfig.dir);
var rssDir = path.join(memoDir, rssConfig.dir);


rss.get('/memo.rdf', function(req, res) {
  var url =  'http://' + req.headers.host + '/';
  rssConfig.feed_url = url + 'rss/memo.rdf';
  rssConfig.site_url = url;
  rssConfig.image_url = url + 'images/yeoman.png';
  rssConfig.docs = url;
  rssConfig.ttl = 60;

  var feed = new Rss(rssConfig);

  fs.readdir(rssDir, function (err, files) {
    files.sort(function (a, b) {
      return a > b ? -1 : 1;
    });
    // console.log(files);

    for (var i = 0, l = files.length; i < l; i++) {
      var file = files[i];
      // console.log(file);

      if (file.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})_(.*)/)) {
        var date = new Date();
        date.setTime(Date.UTC(RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6));
        // console.log(date);

        var title = RegExp.$7 || '(No title)';
        var memo = path.join(rssDir, fs.readlinkSync(path.join(rssDir, file)));
        var url =  'http://' + req.headers.host + '/#/memos' + memo.replace(memoDir, '');
        var description = marked(fs.readFileSync(memo).toString());

        feed.item({
          title: title,
          description: description,
          url: url,
          author: rssConfig.author,
          date: date
        });

        if (feed.items.length >= 10) {
          break;
        }
      }
    }
    // console.log(feed);

    res.set('Content-Type', 'application/xml');
    // res.type('rss');
    res.send(feed.xml());
  });
});

rss.post('/*', function(req, res) {
  var path = MEMO_DIR_FROM_RSS + req.params[0];
  var title = req.query.t;
  // console.log(path);
  // console.log(title);

  var link = RSS_DIR + getDataString() + '_' + title;
  // console.log(link);

  fs.symlink(path, link, function (err) {
    if (err) {
      throw err;
    }
  });

  res.send();
});

function getDataString() {
  function getValue(funcName) {
    var value = date['getUTC' + funcName]();
    if (funcName === 'Month') {
      value++;
    }
    if (value < 10) {
      value = '0' + value;
    }
    return value;
  }

  var date = new Date();

  var funcNames = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds'];
  var dateString = '';
  for (var i = 0; i < funcNames.length; i++) {
    dateString += getValue(funcNames[i]);
  }
  return dateString;
}

module.exports.rss = rss;
