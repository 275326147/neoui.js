
define( [ "ui/Peek", "ui/Pane" ], function() {
        
        return function( container ) {
                
                container.find( ".ui.pane" ).pane();

                $( document.body ).peek( { offset: -60 } );
        };
} );
