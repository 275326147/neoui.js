
define( [ "ui/Slide" ], function() {
        
        var namespace = "$ui.pane";

        $.fn.pane = function( options ) {
                
                var 
                instance = this.data( namespace ),
                settings,
                right, left;

                if ( !instance ) {

                        settings = $.extend( {}, $.fn.pane.defaults, options );

                        right = this.find( settings.selector4right );
                        left = this.find( settings.selector4left );

                        right.data( "originalWidth", right.width() );

                        instance = this.slide( {
                        
                                selector4content: settings.selector4right,

                                onClose: function() {
                                        
                                        collapsed = left.attr( "data-collapsed" ) || settings.collapsed,
                                        expand = right.attr( "data-expand" ) || settings.expand;

                                        left
                                        .css( {
                                                "-webkit-transform": "translateX(-" + collapsed + ")",
                                                "-moz-transform": "translateX(-" + collapsed + ")",
                                                "-ms-transform": "translateX(-" + collapsed + ")",
                                                "transform": "translateX(-" + collapsed + ")"
                                        } );

                                        right.css( "width", expand );
                                },

                                onOpen: function() {
                                        
                                        left
                                        .css( {
                                                "-webkit-transform": "none",
                                                "-moz-transform": "none",
                                                "-ms-transform": "none",
                                                "transform": "none"
                                        } );

                                        right
                                        .css( {
                                                "width": right.data( "originalWidth" )
                                        } );
                                }
                        } );

                        this.addClass( "open" );

                        this.data( namespace, instance );
                }

                return instance;
        };

        $.fn.pane.defaults = {
                
                selector4right 	: ".right:first",
                selector4left 	: ".left:first",

                expand 		: "87%",
                collapsed 	: "82%"
        };
} );
