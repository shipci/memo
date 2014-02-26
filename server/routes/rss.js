
var rssConfig = require('../config').rssConfig;

var rss = require('rss');

var fs = require('fs');

var MEMO_DIR = './memos/';
var MEMO_URL = '#/' + MEMO_DIR;
var MEMO_DIR_FROM_RSS = '../.' + MEMO_DIR;
var RSS_DIR = MEMO_DIR + '.rss/';

var marked = require('marked');

exports.get = function(req, res) {

  var url =  'http://' + req.headers.host + '/';
  rssConfig.feed_url = url + 'rss/memo.rdf';
  rssConfig.site_url = url;
  rssConfig.image_url = url + 'images/yeoman.png';
  rssConfig.docs = url;

  var feed = new rss(rssConfig);

  fs.readdir(RSS_DIR, function (err, files) {
    files.sort(function (a, b) {
      return a > b ? -1 : 1;
    });
    // console.log(files);

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      // console.log(file);

      if (file.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})_(.*)/)) {
        var date = new Date();
        date.setTime(Date.UTC(RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6));
        // console.log(date);

        var title = RegExp.$7 || '(No title)';

        var link = fs.readlinkSync(RSS_DIR + file).replace(MEMO_DIR_FROM_RSS, '');
        var url =  'http://' + req.headers.host + '/' + MEMO_URL + link;
        // var url = req.headers.referer + MEMO_URL + link.replace(MEMO_DIR_FROM_RSS, '');
        // console.log('"' + url + '"');

        var description = marked(fs.readFileSync(MEMO_DIR + link).toString());

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
};

exports.post = function(req, res) {
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
};

function getDataString() {
  var date = new Date();

  var funcNames = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds'];
  var dateString = '';
  for (var i = 0; i < funcNames.length; i++) {
    dateString += getValue(funcNames[i]);
  }
  return dateString;

  function getValue(funcName) {
    var value = date['getUTC' + funcName]();
    if (funcName == 'Month') {
      value++;
    }
    if (value < 10) {
      value = '0' + value;
    }
    return value;
  }
}
