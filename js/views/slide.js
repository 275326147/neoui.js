
define( [ "ui/Peek", "ui/Pane", "ui/Slide" ], function() {
        
        return function( container ) {
                
                container.find( ".ui.slide:first" ).slide();

                $( document.body ).peek();
        };
} );
