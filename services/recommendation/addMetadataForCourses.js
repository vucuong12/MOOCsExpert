//RUN IT BY "node addMetadataForCourse.js"
var request = require("request");
var API_KEY = "d14d86f21eae0c49a5dee9d7b9735e5d7f0e456d";
//var API_KEY = "a611d912dbd05e02ecdc9b0b6124b4aa593adeba";
//var API_KEY = "471ccf386c13f586b9872de945f4834b390a0807";


function getTagsByWaston(query, type,callback) {
 {
    var result = [];
    var dataForm = {
      apikey: API_KEY,//"471ccf386c13f586b9872de945f4834b390a0807",
      outputMode: 'json',
      maxRetrieve: 8,
      linkedData: 0,
      knowledgeGraph: 0
    }
    var url;
    if (type === "text"){
      dataForm.text = query;
      url = "http://gateway-a.watsonplatform.net/calls/text/TextGetRankedKeywords";
    } else {
      dataForm.url = query;
      url = "http://gateway-a.watsonplatform.net/calls/url/URLGetRankedConcepts";
    }
    
      //var url = 'http://gateway-a.watsonplatform.net/calls/url/URLGetRankedConcepts';
    request.post(
      
      {url: url, form: dataForm}, 
      function(err,response,body){
        if (err) {
          log.error('Error getting concepts from waston' + err);
          throw err;
        }
 
        if (response.statusCode == 200) {
          body = JSON.parse(body);
          if (body.status === 'OK') {
            var attribute;
            if (type === 'url')
              attribute = "concepts"
            else
              attribute = "keywords";

            for (var index in body[attribute]) {
              var keyword = body[attribute][index];
              if (keyword.relevance > 0.6) {
                result.push(keyword.text);
              }
            }
          } else {
            return callback("error");
          }
        } else {
          return callback("error - statusCode");
        }
        for (var i in result) result[i] = result[i].toLowerCase();
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
      apikey: API_KEY,//"471ccf386c13f586b9872de945f4834b390a0807",
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
              
              if (taxonomy.confident !== "no" && taxonomy.score >= 0.5) {
                result.push(taxonomy.label);
              }
            }
          } else {
            return callback("error");
          }
        } else {
          return callback("error - statusCode");
        }
        for (var i in result) result[i] = result[i].toLowerCase();
        callback(err, result);
      }
    )
  }
}



var mongoose = require('mongoose');
var mongodbAdd = /*"52.39.232.71" || */"127.0.0.1";
var Course = require('../crawlers/models/Course');

/*Uncomment to RUN*/
// mongoose.connect('mongodb://' + mongodbAdd + ':27017/moocsexpert');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Opened mongoose at mongodbAdd " + mongodbAdd);
//   //updateOnlyTitle();
//   /*var array1 = ["a b c", "x y", "m n"];
//   var array2 = ["c m", "t z", "n u"];
//   console.log(findSimilarPointForTitle(array1, array2));*/
// });

function addToArray(array1, array2){
  for (var i = 0; i < array2.length; i++){
    if (array1.indexOf(array2[i]) === -1){
      array1.push(array2[i]);
    }
  }
}

function updateOnlyTitle(){
  var count = 0;
  Course.find({},function(err, courses){
    var timeout = 0;
    for (var index in courses){
      var course = courses[index];
      if (course.taxonomies.length !== 0 || course.tags.length !== 0)
      if (course.language && course.language.toLowerCase() === "english")
      {
        timeout += 10;
        if (count  === 0)
        (function(course){
          setTimeout(function(){
            console.log("Start with tags");
            getTagsByWaston(course.title,"text", function(err, tags){
              if (err) return console.log(err);
              course.titleTags = tags;
              //addToArray(course.tags, tags);
              course.save(function(err){
                console.log("Done with tags " + ++count);
              });
            })
          }, timeout)
        })(course)
      }
      
    }
  })
}

function run(){
  var udemyCount = 0;
  var courseraCount = 0;
  var timeout = 0;
  var count = 0;
  var count1 = 0;
  Course.find({},function(err, courses){
    for (var index in courses){
      var course = courses[index];
      /*course.taxonomies = [];
      course.tags = [];
      course.save(function(err){
        console.log(index);
      })*/
      if (course.taxonomies.length !== 0 || course.tags.length !== 0)
        count1++;
      if (course.taxonomies.length === 0 && course.tags.length === 0)
      if (course.language && course.language.toLowerCase() === "english")
      if ((course.source === "Udemy" && udemyCount < 20000) 
      ||(course.source === "Coursera" && courseraCount < 2000)){
        //console.log("Course with " + course.source + "");
        if (course.source === "Udemy") {
          udemyCount += 1;
          console.log("-----------> Udemy " + udemyCount);
        } else {
          console.log("-----------> Coursera " + courseraCount);
          courseraCount += 1;
        }
        timeout += 10;
        (function(course){
          setTimeout(function(){
            console.log("Start with tags");
            getTagsByWaston(course.url,"url", function(err, tags){
              if (err) return console.log(err);
              console.log("Done with tags");
              getTaxonomyByWaston(course.url, function(err, taxonomies){
                if (err) return console.log(err);
                console.log(course.cid + " " + course.url);
                course.tags = tags;
                course.taxonomies = taxonomies;
                course.save(function(err){
                  console.log("----------------- Done " + ++count + " " + count1);

                  console.log(course.taxonomies);
                  console.log(course.tags);
                })
                  
              })
            })
          }, timeout)
        })(course)
      }
      
    }
  })
}


function transformToArrayOfWords(titleTags){
  var result = [];
  for (var i in titleTags){
    result = result.concat(titleTags[i].split(" "));
  }
  return result
}

function findSimilarPointForTitle(sampleTitleTags, targetTitleTags){
  var tagArray1 = transformToArrayOfWords(sampleTitleTags);
  var tagArray2 = transformToArrayOfWords(targetTitleTags);
  var intersectionArray = tagArray1.filter(function(n) {
    return tagArray2.indexOf(n) != -1;
  });
  return intersectionArray.length;
}




// Export extract tags from url or text 
module.exports.getTagsByWaston = getTagsByWaston;