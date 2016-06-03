var request = require('request');
var async = require('async');
var cheerio = require("cheerio");
var TOTAL_COURSE = 1896;//0;
var PAGE_SIZE = 100;
var totalPage = Math.floor(TOTAL_COURSE / PAGE_SIZE + 1);
var pageOrder = 0;
var finishedPageNumber = 0;
var timeout = 0;
var count = 0;

var mongoose = require('mongoose');
var mongodbAdd = "52.39.232.71" || "127.0.0.1";
mongoose.connect('mongodb://' + mongodbAdd + ':27017/moocsexpert');
console.log(mongodbAdd);
var Course = require('../crawlers/models/Course');

function run(){
  console.log("start");
  var count = 0;
  Course.find({}, function(err, docs){
    if (err) return console.error(err);
    for (var i in docs){
      var doc = docs[i];
      if (!doc) console.log("DM " + doc);
      
      //doc.category = ["1","2"];
      console.log(doc.source);
      var dm = JSON.parse(doc.categories);
        if (dm.length >= 0)
          console.log(doc.categories);
      doc.category = JSON.parse(doc.categories);
      doc.save(function(err){
        if (err) return console.log(err);
        console.log(count++);

      })
    }
  });
  
}


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Start !");
  run();
});
