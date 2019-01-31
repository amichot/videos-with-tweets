module.exports = function(){
  var config = require('./config.json');
  console.log("error here", config);
  var Twitter = require('twitter-node-client').Twitter;
  var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};
  var twitter = new Twitter({"consumerKey": config.twitter.consumerKey,
  "consumerSecret": config.twitter.consumerSecret,
  "accessToken": config.twitter.accessToken,
  "accessTokenSecret": config.twitter.accessTokenSecret,
  "callBackUrl": "https://amichot.github.io/videos-with-tweets/"});
  return {
    test: function(){
      return twitter.getSearch({'q':'#saints','count': 10}, error, success);
    }
  }
}



