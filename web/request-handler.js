var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
// require more modules/folders here!
var httpHelper = require('./http-helpers.js');
var _ = require('underscore');

exports.handleRequest = function (req, res) {


  var router = function(req, res){
    if(req.method === 'GET'){
      getResponse(req, res);
    } else if(req.method === "POST"){
      collectData(req, function(data){
        postResponse(res, data);
      })
    } else if(req.method === "OPTIONS"){
      //CALL OPTIONS function
    } else {
      httpHelper.writeResponse(res, '', 404);
    }
  }

  router(req, res);
};

var getResponse = function(req, res){
  //call writehead function
  var urlParsed = url.parse(req.url).pathname;
  if (urlParsed === '' || urlParsed === '/') {
    httpHelper.serveAssets(res, archive.paths.siteAssets + '/index.html', function(res, data){
      httpHelper.writeResponse(res, data, 200);
    })
  } else {
    //check the archives
    archive.isUrlArchived(urlParsed.slice(1), function(files) {
      if (_.indexOf(files, urlParsed.slice(1)) > -1) {
        httpHelper.serveAssets(res, archive.paths.archivedSites + urlParsed, function(res, data){
          httpHelper.writeResponse(res, data, 200);
        });
      } else {
        httpHelper.writeResponse(res, 'Page not found', 404);
      }
    });
    //if not in archives
  }
  //if list contains data 
  //if list exists in archive
    //render page
  //if not, render loading page
//if not, add data to list
}

var postResponse = function(res, data){
  // turns buffer object to our url string
  var urlString = JSON.parse(data).url;
  //if list contains data 
  archive.isUrlInList(urlString, function(urls){
    if (_.indexOf(urls, urlString) > -1){
      //check if it is in the archive
      archive.isUrlArchived(urlString, function(files) {
        //if it is archived, serve that request
        if (_.indexOf(files, urlString) > -1){
          httpHelper.serveAssets(res, archive.paths.archivedSites + '/' + urlString, function(res, data){
            httpHelper.writeResponse(res, data, 302);
          });
        } else {
        //if not, we want to serve the loading page
          httpHelper.serveLoadingPage(res);
        }
      });
    } else {
      //if not, add to list and redirect to the loading site
      archive.addUrlToList(urlString, function(){
        httpHelper.serveLoadingPage(res);
      });
    }
  //if not, add data to list
  });
}

var collectData = function(req, callback){
  var dataStorage = "";
  req.on('data', function(data){
    dataStorage += data;
  })
  req.on('end', function(){
    callback(dataStorage)
  })
}