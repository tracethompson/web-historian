var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelper = require('./http-helpers.js');

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
    } else{
      httpHelper.writeResponse(res, '', 404);
    }
  }




  router(req, res);
};

var getResponse = function(req, res){
  //call writehead function
  httpHelper.serveAssets(res, archive.paths.siteAssets + '/index.html', function(res, data){
    httpHelper.writeResponse(res, data, 200);
  })
  //if list contains data 
  //if list exists in archive
    //render page
  //if not, render loading page
//if not, add data to list
}

var postResponse = function(res, data){
  // turns buffer object to our url string
  var urlString = data.toString('utf8').slice(4);
  //if list contains data 
  archive.readListOfUrls(function(data){
    console.log("data: ",data, "url string: ", urlString);
    if(archive.isUrlInList(urlString, data)){
      //load page

    } else {
      //if not, add to list and redirect to the loading site
      archive.addUrlToList(urlString, function(){
        httpHelper.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(res, data){
          httpHelper.writeResponse(res, data, 302);
        });
      });
    }
  //if not, add data to list
  })
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