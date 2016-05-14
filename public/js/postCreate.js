$(document).ready(function() {
  console.log("haha");
  var editorDiv = document.getElementById( 'post-main-editor' );
  var editor = new Squire( editorDiv, {
      blockTag: 'p',
      blockAttributes: {'class': 'paragraph'},
      tagAttributes: {
          ul: {'class': 'UL'},
          ol: {'class': 'OL'},
          li: {'class': 'listItem'},
          a: {'target': '_blank'}
      }
  });
  var postMenu = $('#post-menu');
  console.log(postMenu);
  document.addEventListener( 'click', function ( e ) {
    console.log(id);
      console.log(value);
    var id = e.target.id,
        value;

    if ( id && editor && editor[ id ] ) {
      if ( e.target.className === 'prompt' ) {
        value = prompt( 'Value:' );
      }

      editor[ id ]( value );
    }
  }, false );
})