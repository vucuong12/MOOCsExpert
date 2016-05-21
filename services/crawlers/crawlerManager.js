

var targetSources = ['udemy'];
var count = 0;
for (var i in targetSources){
  var sourceName = targetSources[i];
  var sourceModule = require('./' + sourceName + 'Crawler.js');
  console.log(i);
  sourceModule.run(function(err){
    if (err) throw(err);
    console.log("Done with " + sourceName);
    if (count == targetSources.length){
      console.log("Finish");
    }
  });
}