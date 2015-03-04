
define( [ "ui/Calendar", "ui/Peek" ], function() {
        
        return function( container ) {
        
                $( ".ui.calendar" ).calendar();

                $( document.body ).peek( { offset: -60 } );
        };
} );
