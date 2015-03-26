var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httpHelper = require('./http-helpers.js');
var _ = require('underscore');

exports.handleRequest = function (req, res) {


  var router = function(req, res){
    if(req.method === 'GET'){
      getResponse(req, res);
    } else if(req.method === "POST"){
      httpHelper.collectData(req, function(data){
        postResponse(res, data);
      }) 
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
  }
}

var postResponse = function(res, data){
  // turns buffer object to our url string
  var urlString = data.slice(4);
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
  });
}

