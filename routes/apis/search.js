var keystone = require('keystone');
var request = require('request');
var async = require('async');

module.exports = {

  quickSearch: function (req, res) {
    var locals = res.locals;
    var user = req.user;
    var userName = req.body.value;
    var query = {
      username: new RegExp("\\b"+userName+".*?\\b", "i")
    }

    keystone.list("User").model.find(query)
    .exec(function(err, results) {
      var data = [];
      for (var i in results){
        data.push({
          name: results[i].username
        })
      }
      res.json({success:true, data:data})
    });
  }
} 