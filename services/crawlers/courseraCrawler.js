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
var mongodbAdd = '52.39.232.71' || '127.0.0.1';
mongoose.connect('mongodb://' + mongodbAdd + ':27017/moocsexpert');
var Course = require('./models/Course');


function crawlEachPage(pageNumber, callback){
  var url = "https://api.coursera.org/api/courses.v1?start=" + (pageNumber - 1) * 100 + "&limit=100&fields=workload,photoUrl,courseType,name,id,slug";
  request({url: url}, function (err, response, body) {
    body = JSON.parse(body);
    
    //console.log(body);
    if (err || response.statusCode != 200){
      return callback(false);
    }
    
    callback(true, body);

  });
}

function crawl(callback){
  if (pageOrder + 1 > totalPage){
    return;
  }
  crawlEachPage(++pageOrder, function(success, body){
    if (success){
      var results = body.elements;

      // console.log("result length = " + results.length);
      async.each(results,
        function(course, callback){
          
          var newCourse = {};
          newCourse.cid = course.id;
          newCourse.source = 'Coursera';
          newCourse.title = course.name;
          if (course.courseType === "v2.ondemand"){
            newCourse.url = "https://www.coursera.org/learn/" + course.slug;  
          } else if (course.courseType === "v1.session") {
            newCourse.url = "https://www.coursera.org/course/" + course.slug;
          } else {
            return callback();
          }


          newCourse.smallImageUrl = course.photoUrl;
          newCourse.bigImageUrl = "";
          newCourse.courseraType = course.courseType;
          newCourse.duration = course.workload;
          
          //Get other information by an API call for each course
          var url1 = "https://api.coursera.org/api/courses.v1/" + course.id + 
          "?includes=instructorIds&fields=instructors.v1(firstName, lastName, photo)";
          timeout += 10;
          setTimeout(function(){
            request({url: url1}, function(err, response, body){
              //Get instructors info
              body = JSON.parse(body);
              var instructorInfoList = [];
              if (!err && response.statusCode === 200){
                for (var i in body.linked["instructors.v1"]){
                  var instructor = body.linked["instructors.v1"][i];
                  var instructorInfo = {};
                  instructorInfo.name = instructor.firstName + " " + instructor.lastName;
                  instructorInfo.url = "";
                  instructorInfo.imageUrl = instructor.photo || "";
                  instructorInfoList.push(instructorInfo);
                }
              }
              newCourse.instructors = JSON.stringify(instructorInfoList);
              //Other info
              newCourse.isPaid = "";
              newCourse.price = "";

              
              var lessonsInfo = [];
              var categoriesInfo = [];
              newCourse.language = "";
              newCourse.description = "";

              request({url: newCourse.url}, function(err, response, body){
                // console.log("Request 2");
                if (err || response.statusCode != 200){
                  return callback();
                }

                var $ = cheerio.load(body);
                //Language, Description, Lessons, Categories
                if (course.courseType === "v2.ondemand") {
                  //Language
                  newCourse.language = $("i.cif-language").parents().eq(1).find(".td-data :first-child :first-child").text().trim();
                  if (newCourse.language[newCourse.length - 1] === ',') {
                    newCourse.language = newCourse.language.slice(0, -1);
                  }
                  //Description
                  newCourse.description = "<p>" + $(".body-1-text.course-description span").text() + "</p>";
                  //Lessons
                  $(".lesson-name.body-1-text").each(function(){
                    lessonsInfo.push($(this).text());
                  })
                  //Categories

                } else if(course.courseType === "v1.session") {
                  //Language
                  newCourse.language = $("i.cif-globe").siblings("span").text();
                  //Description and Lesssons
                  $(".rc-CdpDetails .c-cd-section").each(function(){

                    if ($(this).find("h2").text() === "About the Course") {
                      newCourse.description = "<p>" +  $(this).find("p").text() + "</p>";
                      //console.log(newCourse.description);
                    } else if ($(this).find("h2").text() === "Course Syllabus"){

                    }
                  })
                  //categories
                  $(".c-cs-categories div a").each(function(){
                    categoriesInfo.push($(this).text());
                  })

                }

                //Create lessons
                newCourse.categories = JSON.stringify(categoriesInfo);
                newCourse.lessons = JSON.stringify(lessonsInfo);
                var query = {cid:newCourse.cid, source:'Coursera'};
                // if (course.courseType === "v1.session"){
                //   console.log(newCourse);
                // }

                Course.findOneAndUpdate(query, newCourse, {upsert:true}, function(err, doc){
                  if (err) return console.error(err);
                  console.log(count++);
                  callback(err);
                });           
              })
            })
          }, timeout)
          
        },
        function(err){
          if (err) {
            mongoose.connection.close();
            console.log(err);
          }

          finishedPageNumber++;
          console.log('finishedPageNumber ' + finishedPageNumber + " total " + totalPage);
          console.log("Crawl after 0 seconds");
          setTimeout(function(){
            crawl();
          }, 0)
          if (finishedPageNumber === totalPage) {
            mongoose.connection.close();
            console.log("Done with Coursera");
          }
        })
    }
  })
  
}

module.exports.run = function(callback){
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
    crawl();
  });
}
