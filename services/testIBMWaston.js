var request = require("request");

function getConceptsByWaston(query,callback) {

  
 {
    var newQuery = '';
    var dataForm = {
      url: query,
      apikey: "d14d86f21eae0c49a5dee9d7b9735e5d7f0e456d",//"471ccf386c13f586b9872de945f4834b390a0807",
      outputMode: 'json',
      maxRetrieve: 8,
      linkedData: 0,
      knowledgeGraph: 1
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
          console.log(JSON.stringify(body));
          if (body.status === 'OK') {
            for (var index in body.concepts) {
              var concept = body.concepts[index];
              if (concept.relevance > 0.0) {
       
                newQuery = newQuery + concept.text + " ";
                
              }
            }
          }
        }
        callback(err, newQuery);
      }
    )
  }
  
}

getConceptsByWaston("http://110.76.94.231:3000/post?postId=575a7abf9a2adbf72dc879b3", function(err, newQuery){
  console.log(newQuery);
})