
var rss = require('rss');
var feed = new rss({
    title: 'memo blog',
    description: 'memo blog',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    image_url: 'http://example.com/icon.png',
    docs: 'http://example.com/rss/docs.html',
    author: 'Ikuo Terado',
    managingEditor: 'Ikuo Terado',
    webMaster: 'Ikuo Terado',
    copyright: '2014 Ikuo Terado',
    language: 'en',
    categories: ['Category 1','Category 2','Category 3'],
    pubDate: 'Feb 4, 2014 04:00:00 GMT',
    ttl: '60'
});

exports.get = function(req, res) {
	var xml = feed.xml();
	// console.log(xml);
	res.set('Content-Type', 'application/xml');
	res.send(xml);
};
