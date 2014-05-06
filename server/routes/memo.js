'use strict';

var fs = require('fs');
var path = require('path');
var Q = require('q');

var MEMO_DIR = './memos';

var memos = require('express').Router();

memos.get(/^(.*)$/, function (req, res) {
  var dir = path.join(MEMO_DIR, req.params[0]);

  getMemoList(dir).then(function (memoList) {
    res.send(memoList);
  }, function (error) {
    console.error(error);
  });
});

function getMemoList (dir) {
  var deferred = Q.defer();

  var fs_readdir = Q.denodeify(fs.readdir);
  fs_readdir(dir).then(function (files) {
    Q.all(files.map(function (file) {
      return getFileInfo(dir, file);
    })).then(function (memoList) {
      deferred.resolve(memoList);
    });
  });

  return deferred.promise;
}

function getFileInfo (dir, file) {
  var deferred = Q.defer();

  var fs_stat = Q.denodeify(fs.stat);
  fs_stat(path.join(dir, file)).then(function (stat) {
    var fileInfo = {
      name: file,
      type: stat.isFile() ? 'file' : 'dir',
      hidden: file.charAt(0) === '.'
    };
    deferred.resolve(fileInfo);
  });

  return deferred.promise;
}


module.exports.memos = memos;
