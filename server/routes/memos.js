'use strict';

var memos = require('express').Router();

var fs = require('fs');
var path = require('path');
var Q = require('q');
var memoConfig = require('../config').memoConfig;

memos.get(/^(.*)$/, function (req, res) {
  var file = path.join(memoConfig.dir, req.params[0]);

  var fs_stat = Q.denodeify(fs.stat);
  fs_stat(file).then(function (stat) {
    if (stat.isFile()) {
      res.sendfile(file);
    } else {
      getMemoList(file).then(function (memoList) {
        res.send(memoList);
      }, function (error) {
        res.send(500, {error: error});
      });
    }
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
  }, function (error) {
    deferred.reject(error);
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

memos.post(/^(.*)$/, function (req, res) {
  var file = req.params[0];

  var makeFunc;
  if (file.charAt(file.length - 1) === '/') {
    makeFunc = makeDir;
    file = file.slice(0, -1);
  } else {
    makeFunc = makeFile;
  }

  makeFunc(file).then(function () {
    var dir = path.join(memoConfig.dir, getDir(file));
    return getMemoList(dir).then(function (memoList) {
      res.send(memoList);
    });
  }).catch(function (error) {
    res.send(500, {error: error});
  });
});

function makeDir (file) {
  var deferred = Q.defer();

  fs.mkdir(path.join(memoConfig.dir, file), deferred.makeNodeResolver());

  return deferred.promise;
}

function makeFile (file) {
  var deferred = Q.defer();

  var fs_open = Q.denodeify(fs.open);
  fs_open(path.join(memoConfig.dir, file), 'wx').then(function (fd) {
    fs.close(fd, deferred.makeNodeResolver());
  }).catch(function (error) {
    deferred.reject(error);
  });

  return deferred.promise;
}

function getDir (file) {
  var lastIndex = file.lastIndexOf('/');
  return lastIndex !== -1 ? file.slice(0, lastIndex) : '';
}

memos.put(/^(.*)$/, function (req, res) {
  var file = path.join(memoConfig.dir, req.params[0]);
  var dir = getDir(file);
  var newFile = path.join(dir, req.query.new);

  var fs_rename = Q.denodeify(fs.rename);
  fs_rename(file, newFile).then(function () {
    return getMemoList(dir).then(function (memoList) {
      res.send(memoList);
    });
  }).catch(function (error) {
    res.send(500, {error: error});
  });
});

memos.delete(/^(.*)$/, function (req, res) {
  var file = path.join(memoConfig.dir, req.params[0]);
  var dir = getDir(file);

  var fs_stat = Q.denodeify(fs.stat);
  fs_stat(file).then(function (stat) {
    var removeFunc = Q.denodeify(stat.isFile() ? fs.unlink : fs.rmdir);
    removeFunc(file).then(function () {
      return getMemoList(dir).then(function (memoList) {
        res.send(memoList);
      });
    });
  }).catch(function (error) {
    res.send(500, {error: error});
  });
});


module.exports.memos = memos;
