var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var courseSchema = new Schema({
  cid: {type:String},       //the id is unique in system
  source: {type: String},   //Example: Coursera, Edx, Udemy
  title: {type: String} ,     //short name of the course
  url: {type: String},
  smallImageUrl: {type: String},
  bigImageUrl : {type: String},
  language: {type:String},  //Text will be formated into JSON object "[,]"
  description: {type: String},
  instructors: {type: String}, //[]
  lessons: {type: String},
  duration: {type: String},
  categories: {type: String}, //[]
  isPaid: {type: Boolean},
  price: {type: String}
});
var Course = mongoose.model('Course',courseSchema);

module.exports = Course;