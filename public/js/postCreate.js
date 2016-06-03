$('#post-course-list').on('change', function() {
  if (courseList.length === 0) return;
  var index = $(this).find(":selected").data("index");
  var lessons = courseList[index].lessons;
  console.log("DM");
  $("#lessons-list").empty();
  var $label = $("<label>", {text: "Select Lesson"});
  $("#lessons-list").append($label);
  if (lessons.length === 0){
    var $input = $("<input>", {id:"lesson-input", type:"text", placeholder:"Enter related lesson"});
    $("#lessons-list").append($input);
  } else {
    var $select = $("<select>", {id:"post-lesson-list", class:"form-control"});
    for (var index in lessons){
      var lesson = lessons[index];
      var $option = $("<option>", {class:"lesson-name", value: "Lesson " + index +": " + lesson, text: "Lesson " + index +": " + lesson});
      $select.append($option);
    }
    $("#lessons-list").append($select);
  }

});

$(document).ready(function() {
  var editor; //global value
  //add new function to Squire
  Squire.prototype.testPresenceinSelection = function(name, action, format,
    validation) {
    var path = this.getPath(),
        test = (validation.test(path) | this.hasFormat(format));
    // console.log("path"); console.log(path);
    // console.log("hasFormat"); console.log(this.hasFormat(format));
    // console.log("----------------");
    if (name == action && test) {
      return true;
    } else {
      return false;
    }

  };

  var editorDiv = document.getElementById( 'post-main-editor' );
  editor = new Squire( editorDiv, {
      blockTag: 'p',
      blockAttributes: {'class': 'paragraph'},
      tagAttributes: {
          ul: {'class': 'UL'},
          ol: {'class': 'OL'},
          li: {'class': 'listItem'},
          a: {'target': '_blank'}
      }
  });
  $("#alignLeft").addClass("selected");

  //Check state of each item after a click event to make corresponding change
  $('.post-item').click(function() {

    //var iframe = $(this).parents('.Squire-UI').next('iframe').first()[0];
    var action = $(this).data('action');

    test = {
      value: action,
      testBold: editor.testPresenceinSelection('bold',
        action, 'B', (/>B\b/)),
      testItalic: editor.testPresenceinSelection('italic',
        action, 'I', (/>I\b/)),
      testUnderline: editor.testPresenceinSelection(
        'underline', action, 'U', (/>U\b/)),
      testOrderedList: editor.testPresenceinSelection(
        'makeOrderedList', action, 'OL', (/>OL\b/)),
      testLink: editor.testPresenceinSelection('makeLink',
        action, 'A', (/>A\b/)),
      testQuote: editor.testPresenceinSelection(
        'increaseQuoteLevel', action, 'blockquote', (
          />blockquote\b/)),
      isNotValue: function (a) {return (a == action && this.value !== ''); }
    };

    editor.alignRight = function () { editor.setTextAlignment('right'); };
    editor.alignCenter = function () { editor.setTextAlignment('center'); };
    editor.alignLeft = function () { editor.setTextAlignment('left'); };
    editor.alignJustify = function () { editor.setTextAlignment('justify'); };
    editor.makeHeading = function () { editor.setFontSize('2em'); editor.bold(); };

    if (test.testBold | test.testItalic | test.testUnderline | test.testOrderedList | test.testLink | test.testQuote) {
      if (test.testBold) editor.removeBold();
      if (test.testItalic) editor.removeItalic();
      if (test.testUnderline) editor.removeUnderline();
      if (test.testLink) editor.removeLink();
      if (test.testOrderedList) editor.removeList();
      if (test.testQuote) editor.decreaseQuoteLevel();
      $(this).toggleClass("selected");
    } else if (test.isNotValue('makeLink') | test.isNotValue('insertImage') | test.isNotValue('selectFont')) {
      // do nothing these are dropdowns.

    } else {
   
        if (action != "makeHeading" && action != "undo" && action != "redo"){
          $('.align').each(function(index){
            $(this).removeClass("selected");
          })
          $(this).addClass("selected");
        } else if (action == "makeHeading"){
          $(this).toggleClass("selected");
        }
          
        editor[action]();
        editor.focus();
    }
  })

  // $('#popover-selectFont').popover({ 
  //   html : true,
  //   content: function() {
  //     return $('#content-selectFont').html();
  //   }
  // });
  $('.post-item a').click(function(event){
    event.preventDefault();
    
  })

  $('.post-item a').click(function(event){
    event.preventDefault();
    
  })

  $("#selectFont").click(function(event){
    if (event.target !== document.getElementById("selectFont") && event.target !== document.getElementById("font-icon")){
      return;
    }
    $('#popover-selectFont').popover({ 
      html : true,
      title : '<span class="text-info"><strong>Select Font</strong></span>'+
                '<button type="button" id="close" class="close" onclick="$(&quot;#popover-selectFont&quot;).popover(&quot;toggle&quot;);">&times;</button>',
      content: function() {
        var html =  $('#content-selectFont').html();
        //$( "#content-selectFont" ).remove();
        return html;
      }
      
    });
    if (event.target === document.getElementById("selectFont") || event.target == document.getElementById("font-icon")){
      $('#popover-selectFont').popover("toggle");

    }
    
  });

  $(document).on("click", "#selectFont select.fontSelect", function(event){
    var selectedFonts = $(this).children(":selected").data('fonts');
    console.log("asdfasdf " + selectedFonts);
    try {
      editor.setFontFace(selectedFonts);
    } catch (e) {
      alert('Please make a selection of text.');
    } finally {
      //$(this).parent().parent().removeClass('drop-open');
    }
  })

  //cannot use $(".textSelector").click because .textSelector hasn't been available-> cannot assign handler
  //Instead, assign both element and handler to document
  $(document).on("click","#selectFont select.textSelector", function(event){
    
    event.stopPropagation();
    var fontSize =  $(this).children(":selected").data('size') + 'px';
    console.log("fontsize = " + fontSize);
    editor.setFontSize(fontSize);
  });

  $("#selectLink").click(function(event){
    if (event.target !== document.getElementById("selectLink") && event.target !== document.getElementById("link-icon")){
      return;
    }
    $('#popover-selectLink').popover({ 
      html : true,
      title : '<span class="text-info"><strong>Insert Link</strong></span>'+
                '<button type="button" id="close" class="close" onclick="$(&quot;#popover-selectLink&quot;).popover(&quot;toggle&quot;);">&times;</button>',
      content: function() {
        var html =  $('#content-selectLink').html();
        //$( "#content-selectFont" ).remove();
        return html;
      }
      
    });
    if (event.target === document.getElementById("selectLink") || event.target == document.getElementById("link-icon")){
      $('#popover-selectLink').popover("toggle");
    }
    
  });

  $(document).on("click","#selectLink .btn.submitLink", function(event){
    
    event.stopPropagation();
    var linkUrl =  $("#selectLink input").val();
    console.log("linkUrl = " + linkUrl);
    editor.makeLink(linkUrl);
  });

  $("#selectImage").click(function(event){
    if (event.target !== document.getElementById("selectImage") && event.target !== document.getElementById("image-icon")){
      return;
    }

    $('#popover-selectImage').popover({ 
      html : true,
      title : '<span class="text-info"><strong>Insert Image</strong></span>'+
                '<button type="button" id="close" class="close" onclick="$(&quot;#popover-selectImage&quot;).popover(&quot;toggle&quot;);">&times;</button>',
      content: function() {
        var html =  $('#content-selectImage').html();
        //$( "#content-selectFont" ).remove();
        return html;
      }
      
    });
    if (event.target === document.getElementById("selectImage") || event.target == document.getElementById("image-icon")){
      $('#popover-selectImage').popover("toggle");
    }
    
  });

  $(document).on("click","#selectImage .btn.submitImage", function(event){
    
    event.stopPropagation();
    var imageUrl =  $("#selectImage input").val();
    editor.insertImage(imageUrl);
  });
})

