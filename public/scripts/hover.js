$( document ).ready(function(){
    var faded = 0.5;
    var display = 1.0;
    $('.imagewrap').hover(
        function() {
            var img = $( this ).find( "img" );
            var title = $(this ).find( "h3" );
            img.fadeTo( "slow", faded );
            title.fadeIn();
        }, function() {
            var img = $( this ).find( "img" );
            var title = $( this ).find ( "h3" );
            img.fadeTo( "slow", display );
            title.fadeOut();
        }
    );
});
