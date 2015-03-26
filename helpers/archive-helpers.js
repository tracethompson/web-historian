var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelper = require('../web/http-helpers.js')
var http = require('http')

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, {encoding: 'utf8'}, function(err, data){
    //format into an array
    if (err) throw err;
    var urls = data.split('\n');
    callback(urls);
  })
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(urls){
    callback(urls);
  })
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url + '\n', function(err){
    if(err) throw err;
    console.log("data was appended to file!");
    callback();
  });
};

exports.isUrlArchived = function(urlString, callback){
  fs.readdir(exports.paths.archivedSites, function(err, files){
    if (err) throw err;
    callback(files);
  });
};

exports.downloadUrls = function(urlArray){
  _.each(urlArray, function(url){
    exports.isUrlArchived(url, function(err, files){
      if(_.indexOf(files, url) === -1){
        exports.reqSite(url);
      };
    })
  })
};

exports.reqSite = function(url){
  var options = {
    host: url,
    port: 80,
    path: '/index.html'
  };

  http.get(options, function(res){
    httpHelper.collectData(res, function(data){
      fs.writeFile('archives/sites/'+url, data, function(err){
        if(err) throw err;
        console.log('file saved!');
      })
    })
  }).on('error', function(e){ if(e) throw e; })
}

