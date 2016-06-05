var keystone = require('keystone');
var async = require('async');

module.exports = {

  get: function (req, res) {
    var source = req.body.source;
    var categories = [];
    if (source === "Udemy"){
      categories.push("Academics");
      categories.push("Business");
      categories.push("Crafts & Hobbies");
      categories.push("Design");
      categories.push("Development");
      categories.push("Games");
      categories.push("Health & Fitness");
      categories.push("Humanities");
      categories.push("IT & Software");
      categories.push("Language");
      categories.push("Lifestyle");
      categories.push("Marketing");
      categories.push("Math & Science");
      categories.push("Music");
      categories.push("Office Productivity");
      categories.push("Personal Development");
      categories.push("Photography");
      categories.push("Social Science");
      categories.push("Sports");
      categories.push("Teacher Training");
      categories.push("Technology");
      categories.push("Test");
      categories.push("Test Prep");
      categories.push("Other");
    } else if (source === "Coursera"){
      categories.push("Arts");
      categories.push("Humanities");
      categories.push("Information, Tech & Design");
      categories.push("Education");
      categories.push("Social Sciences");
      categories.push("Music, Film, and Audio");
      categories.push("Business & Management");
      categories.push("Teacher Professional Development");
      categories.push("Economics & Finance");
      categories.push("Biology & Life Sciences");
      categories.push("Food and Nutrition");
      categories.push("Law");
      categories.push("Energy & Earth Sciences");
      categories.push("Physics");
      categories.push("Physical & Earth Sciences");
      categories.push("Chemistry");
      categories.push("Health & Society");
      categories.push("Engineering");
      categories.push("Medicine");
      categories.push("Mathematics");
      categories.push("Computer Science: Software Engineering");
      categories.push("Computer Science: Artificial Intelligence");
      categories.push("Computer Science: Theory");
      categories.push("Computer Science: Systems & Security");
    }
    res.json({success: true, categories: categories})
  }
}