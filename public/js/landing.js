$(".index-source").click(function(){
  var query = {
    source: $(this).data("source")
  }
  post("/categories/get", query, function(data){
    if (data.success === true){
      $("#categories-list").html("");
      console.log($("#categories-list").length)
      $("<hr>").appendTo("#categories-list");
      $("<h3>", {"text": query.source}).appendTo("#categories-list");
      for (var index in data.categories){
        var category = data.categories[index];
        var encodedCategory = encodeURIComponent(category)
        var $a = $("<a>", {"href":"/search/categories?source=" + query.source +"&category=" + encodedCategory, "text": category});
        
        $("<li>", {class:"menu-item"}).append($a).appendTo("#categories-list");
      }
      
    } else {
      alert("Error with get categories, try again !")
    }
  })

})