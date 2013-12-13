/*  Youtube Extension
    ^http://www.youtube.com/watch?v=0mmx68VmTEo  ->
    <iframe  src=\"//www.youtube.com/embed/0mmx68VmTEo?rel=0\"\nframeborder=\"0\" allowfullscreen></iframe>
*/

(function() {
  var youtube = function(converter) {
    return [
      {
        type: 'lang',
        regex: '\\^\\^([\\S]+)',
        replace: function(match, url) {
          var videoId = null;
          var width = 640;
          var height = 390;

          var youtubeWH = /^\[(\d+)x(\d+)\].*((youtube\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
          var youtube   = /^.*((youtube\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

          if (youtubeWH.test(url)) {
            var m = url.match(youtubeWH);
            if (m && m[9].length === 11) {
              width = m[1];
              height = m[2];
              videoId = m[9];
            }
          } else if (youtube.test(url)) {
            var m = url.match(youtube);
            if (m && m[7].length === 11) {
              videoId = m[7];
            }
          }

          if (videoId) {
            return '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' + videoId + '?rel=0" frameborder="0" allowfullscreen></iframe>';
          } else {
            return match;
          }
        }
      }
    ];
  };

  // Client-side export
  if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.youtube = youtube; }
  // Server-side export
  if (typeof module !== 'undefined') module.exports = youtube;

}());
