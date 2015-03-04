
define( [ "ui/Tab", "ui/Peek" ], function() {
        
        return function( container ) {
        
                container
                .find( ".ui.tab" ).tab();

                $( document.body ).peek( { offset: -60 } );
        };
} );
