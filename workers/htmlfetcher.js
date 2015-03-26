#!/usr/bin/env node
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

/*
In crontab:
* * * * * /usr/bin/node path
*/
var archive = require('/Users/student/MKS15-web-historian/helpers/archive-helpers.js');

archive.readListOfUrls(function(urlArray) {
  archive.downloadUrls(urlArray);
});