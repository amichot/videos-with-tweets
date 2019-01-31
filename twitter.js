module.exports = function(){
  var Twitter = require('twitter-node-client').Twitter;
  return {
    test: function(){
      return twitter.getSearch({'q':'#saints','count': 10}, error, success);
    }
  }
}



