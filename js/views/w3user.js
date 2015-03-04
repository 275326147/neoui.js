
define( [ "ui/Peek", "ui/W3user" ], function() {
        
        return function( container ) {
                
                container.find( ".ui.w3user" ).w3user();

                $( document.body ).peek();
        };
} );
