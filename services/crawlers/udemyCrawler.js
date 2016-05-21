var request = require('request');
var async = require('async');
var cheerio = require("cheerio");
var TOTAL_COURSE = 28978;//0;
var PAGE_SIZE = 50;
var totalPage = Math.floor(TOTAL_COURSE / PAGE_SIZE + 1);
var pageOrder = 0;
var finishedPageNumber = 0;
var username = 'y7z9E7NnzXJzMMvHXi3opJReg5iLAEibmy0c7zD2',
    password = 'lA8TJhj2UO6Kf4af5ldbwnIcXPz6756FWgur1BRca3YeBMs3sFUrb0kqqEomEJ5t86jXrI1LsG80cppNiMNjoDsuM5S19MnfeZ2F8IJjaTEImuEoHsiiVoFQpCSPdX1g';
//require('dotenv').load();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/moocsexpert');

var Course = require('./models/Course')


function crawlEachPage(pageNumber, callback){
  var url = 'http://' + username + ':' + password + '@www.udemy.com/api-2.0/courses' + '?page=' + pageNumber + '&page_size=' + PAGE_SIZE;
  console.log(url);
  request({url: url}, function (err, response, body) {
    if (err || response.statusCode != 200){
      return callback(false);
    }
    body = JSON.parse(body);
    
    callback(true, body);
  });
}

function crawl(callback){
  if (pageOrder + 1 > totalPage){
    return;
  }
  crawlEachPage(++pageOrder, function(success, body){
    if (success){
      var results = body.results;
      // console.log("result length = " + results.length);
      async.each(results,
        function(course, callback){
          var newCourse = {};
          newCourse.cid = course.id;
          newCourse.source = 'Udemy';
          newCourse.title = course.title;
          newCourse.url = 'https://www.udemy.com' + course.url;
          newCourse.smallImageUrl = course.image_125_H;
          newCourse.bigImageUrl = course.image_240x135;
          
          
          var instructorInfoList = [];
          
          for (var i in course.visible_instructors){
            var instructorInfo = {};
            instructorInfo.name = course.visible_instructors[i].display_name;
            instructorInfo.url = 'https://www.udemy.com' + course.visible_instructors[i].url;
            instructorInfo.imageUrl = course.visible_instructors[i].image_100x100;
            instructorInfoList.push(instructorInfo);
          }
          
          newCourse.instructors = JSON.stringify(instructorInfoList);
          newCourse.isPaid = course.is_paid;
          newCourse.price = course.price;
          var lessonsInfo = [];
          var categoriesInfo = [];
          request({url: newCourse.url}, function(err, response, body){
            // console.log("Request 2");
            if (err || response.statusCode != 200){
              return callback("error2 " + error + " Statuscode " + response.statusCode);
            }
            var $ = cheerio.load(body);
            $('.right-middle.col-md-11.col-sm-6 li.list-item').each(function(index){
              
              var value = $(this).find(".list-right").text();
              
              if (index === 1){
                newCourse.duration = value.trim();
              } else if (index === 3){
                newCourse.language = value.trim();
              }
            })
            //Create categories
            $('.cats a').each(function(index){
              categoriesInfo.push($(this).text());
            })
            newCourse.categories = JSON.stringify(categoriesInfo);
            //Create description
            newCourse.description = $('#desc .js-simple-collapse-inner').text().trim();
            //console.log(newCourse);
            
            var query = {cid:newCourse.cid, source:'Udemy'};
            Course.findOneAndUpdate(query, newCourse, {upsert:true}, function(err, doc){
              if (err) return console.error(err);
              callback(err);
            });              
          })
          // var syllabusUrl = 'http://' + username + ':' + password + '@www.udemy.com/api-2.0/courses/' + course.id +'/public-curriculum-items/?page=1&page_size=1000';
          
          // request({url: syllabusUrl}, function (err, response, body) {
          //   // console.log("Request 1");
          //   if (err || response.statusCode != 200){
          //     return callback("error1 " + err + " Statuscode " + response.statusCode);
          //   }
          //   body = JSON.parse(body);
          //   var syllabusResults = body.results;
           
          //   
          //   

          //   for (var lessonIndex in syllabusResults){
          //     var lesson = syllabusResults[lessonIndex];
          //     if (lesson._class == "lecture"){
          //       lessonsInfo.push(lesson.title);
          //     }
          //   }
          //   //Create lessons
          //   newCourse.lessons = JSON.stringify(lessonsInfo);

          //   request({url: newCourse.url}, function(err, response, body){
          //     // console.log("Request 2");
          //     if (err || response.statusCode != 200){
          //       return callback("error2 " + error + " Statuscode " + response.statusCode);
          //     }
          //     var $ = cheerio.load(body);
          //     $('.right-middle.col-md-11.col-sm-6 li.list-item').each(function(index){
                
          //       var value = $(this).find(".list-right").text();
                
          //       if (index === 1){
          //         newCourse.duration = value.trim();
          //       } else if (index === 3){
          //         newCourse.language = value.trim();
          //       }
          //     })
          //     //Create categories
          //     $('.cats a').each(function(index){
          //       categoriesInfo.push($(this).text());
          //     })
          //     newCourse.categories = JSON.stringify(categoriesInfo);
          //     //Create description
          //     newCourse.description = $('#desc .js-simple-collapse-inner').text().trim();
          //     //console.log(newCourse);
              
          //     var query = {cid:newCourse.cid, source:'Udemy'};
          //     Course.findOneAndUpdate(query, newCourse, {upsert:true}, function(err, doc){
          //       if (err) return console.error(err);
          //       callback(err);
          //     });              
          //   })
          // });
        },
        function(err){
          if (err) {
            mongoose.connection.close();
            console.log(err);
            throw err;
          }

          finishedPageNumber++;
          console.log('finishedPageNumber ' + finishedPageNumber + " total " + totalPage);
          if (finishedPageNumber === totalPage) {
            mongoose.connection.close();
          }
        })
    }
  })
  console.log("Crawl after 5 seconds");
  setTimeout(function(){
    crawl();
  }, 5000)
}

module.exports.run = function(callback){
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
    
    crawl();
    
    
  });
}
