var request = require("request");
var API_KEY = "d14d86f21eae0c49a5dee9d7b9735e5d7f0e456d";
// var API_KEY = "a611d912dbd05e02ecdc9b0b6124b4aa593adeba";
// var API_KEY = "471ccf386c13f586b9872de945f4834b390a0807";


function getTagsByWaston(query,callback) {
 {
    var result = [];
    var dataForm = {
      url: query,
      apikey: "471ccf386c13f586b9872de945f4834b390a0807",//"471ccf386c13f586b9872de945f4834b390a0807",
      outputMode: 'json',
      maxRetrieve: 8,
      linkedData: 0,
      knowledgeGraph: 0
    }
    var url = " http://gateway-a.watsonplatform.net/calls/url/URLGetRankedConcepts";
      //var url = 'http://gateway-a.watsonplatform.net/calls/url/URLGetRankedConcepts';
    request.post(
      
      {url: url, form: dataForm}, 
      function(err,response,body){
        if (err) {
          sails.log.error('Error getting concepts from waston' + err);
          throw err;
        }
 
        if (response.statusCode == 200) {
          body = JSON.parse(body);
          if (body.status === 'OK') {
            for (var index in body.concepts) {
              var concept = body.concepts[index];
              if (concept.relevance > 0.6) {
                result.push(concept.text);
              }
            }
          } else {
            return callback("error");
          }
        } else {
          return callback("error - statusCode");
        }
        callback(err, result);
      }
    )
  }
}

function getTaxonomyByWaston(query,callback) {
 {
    var result = [];
    var dataForm = {
      url: query,
      apikey: "471ccf386c13f586b9872de945f4834b390a0807",//"471ccf386c13f586b9872de945f4834b390a0807",
      outputMode: 'json',
      maxRetrieve: 8,
      linkedData: 0,
      knowledgeGraph: 0
    }
    var url = " http://gateway-a.watsonplatform.net/calls/url/URLGetRankedTaxonomy";
      //var url = 'http://gateway-a.watsonplatform.net/calls/url/URLGetRankedConcepts';
    request.post(
      
      {url: url, form: dataForm}, 
      function(err,response,body){
        if (err) {
          sails.log.error('Error getting concepts from waston' + err);
          throw err;
        }
 
        if (response.statusCode === 200) {
          body = JSON.parse(body);
          if (body.status === 'OK') {
            for (var index in body.taxonomy) {
              var taxonomy = body.taxonomy[index];
              if (taxonomy.confident !== "no") {
                result.push(taxonomy.label);
              }
            }
          } else {
            return callback("error");
          }
        } else {
          return callback("error - statusCode");
        }
        callback(err, result);
      }
    )
  }
}



var mongoose = require('mongoose');
var mongodbAdd = "52.39.232.71" || "127.0.0.1";
mongoose.connect('mongodb://' + mongodbAdd + ':27017/moocsexpert');
var Course = require('../crawlers/models/Course');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Opened mongoose at mongodbAdd " + mongodbAdd);
  run();
});

function run(){
  var udemyCount = 0;
  var courseraCount = 0;
  Course.find({source:"Coursera"},function(err, courses){
    console.log("DM " + courses.length);
    for (var index in courses){
      var course = courses[index];
      console.log(index + " :  " + course.source);
      //console.log(course.source);
      if (!course.taxonomies && !course.tags)
      if (course.language && course.language.toLowerCase() === "english")
      if ((course.source === "Udemy" && udemyCount < 1) 
      ||(course.source === "Coursera" && courseraCount < 1)){
        //console.log("Course with " + course.source + "");
        if (course.source === "Udemy") {
          udemyCount += 1;
        } else {
          courseraCount += 1;
        }
        getTagsByWaston(course.url, function(err, tags){
          if (err) return;
          console.log("Done with tags");
          getTaxonomyByWaston(course.url, function(err, taxonomies){
            if (err) return;
            console.log(course.cid);
            course.tags = tags;
            course.taxonomies = taxonomies;
            course.save(function(err,newCourse){
              console.log("Done ");
              console.log(course.taxonomies);
              console.log(course.tags);
            })
          })
        })
      }
      
    }
  })
}


