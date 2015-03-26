var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(asset, function(err, data) {
    if(err){ throw err;}
    callback(res, data);
  })
};

exports.writeResponse = function(res, data, status){
  res.writeHead(status, headers);
  res.write(data);
  res.end();
}

exports.serveLoadingPage = function(res){
  exports.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(res, data){
    exports.writeResponse(res, data, 302);
  });
}

exports.collectData = function(req, callback){
  var dataStorage = "";
  req.on('data', function(data){
    dataStorage += data;
  })
  req.on('end', function(){
    callback(dataStorage)
  })
}
// As you progress, keep thinking about what helper functions you can put here!
