
define( [ "self/common/util/Template", 
		"self/common/ui/Dialog",
		"self/common/ui/W3user",
		"self/common/ui/Ripple",
		"self/common/ui/NTree",
		"self/common/ui/ProgressButton",
		"self/common/ui/Calendar" ], function( Template ) {

        "use strict";

	var hook = {
		
		"dialog": function( target, options ) {

		        return {
		                instance: target.dialog( options )
		        };
		},

		"calendar": function( target, options ) {
			return  {
			        instance: target.calendar( options )
			};
		},

		"dropdown": function( target, options ) {

                        return {
                                instance: target.dropdown( $.extend( {}, {
                                        nothing: "Dropdown",
                                        readonly: true
                                }, options || {} ) )
                        };
		},

		"w3user": function( target, options ) {

			return {
			        instance: target.w3user()
			};
		},

		"progressButton": function( target, options ) {

			return {
			        instance: target.progressButton( options )
			};
		},

		"tab": function( target, options ) {

                        return {
                                instance: target.tab( options )
                        };
		},

		"ntree": function( target, options ) {
	                
	                return {
	                        instance: target.ntree( options )
	                };
		},

		"template": function( target, options ) {

			var 
			settings = {
				
				container: target,
				selector4save: "button[name=save]",
				selector4delete: "button[name=delete]",
				selector4default: "button[name=setDefault]",
				selector4reset: "button[name=reset]",
				selector4template: "select[name=template]"
			},
			instance = Template( $.extend( {}, settings, options || {} ) );

			return {
			        instance: instance
			};
		},

		"select": function( target, options ) {

		        var 
		        request, 
                        settings = $.extend( {
                                valueKey: "value",
                                textKey: "text",
                                moduleName: "gridElement_kiss"
                        }, options ),
                        deferred = $.Deferred(),
		        buildOptions = function( data ) {

		                var html = "";
                                for ( var i = 0, length = data.length; i < length; ++i ) {
                                        var item = data[ i ];

                                        html += "<option value='" + item[ settings.valueKey || settings.textKey ] + "'>" + item[ settings.textKey ] + "</option>";
                                }
                                target.append( html );
		        };

		        if ( options.lookupName ) {
                                
                                settings.textKey = "attribute1";
                                settings.valueKey = "meaning";

                                request = $.ajax( {
                                        data: {
                                                name: "fnd.lookup.GeLookupCodes",
                                                params: JSON.stringify( {
                                                        needGridInterceptor: "true",
                                                        lookup_type: options.lookupName
                                                } )
                                        }
                                } )
                                .done( function( data ) {
                                
                                        data = eval( "(" + data + ")" )[ "result" ][ "gridElement_fnd.lookup.geLookupCodes" ];
                                        data = JSON.parse( data ).result;
                                        buildOptions( data );
                                } );
		        } else {
                                request = $.ajax( {
                                        data: settings.data
                                } )
                                .done( function( data ) {

                                        data = eval( "(" + data + ")" ).result[ settings.moduleName ];
                                        data = JSON.parse( data ).result;
                                        buildOptions( data );
                                } );
		        }
		
                        request
                        .done( deferred.resolve )
                        .fail( deferred.reject );

                        return {
                                instance: target,
                                promise: deferred.promise()
                        };
                }
	},

        /** Reserved name */
	reserved = [ "waiting" ],
	
	defaultShims = {

                "ripple": function( container ) {

                        container
                        .delegate( "button.ripple-btn", "click", function( e ) {
                                $( this ).ripple().start( e );
                        } );
                },

                "pane": function( container ) {

                        var workspaceRight = container.find( "div.pane.right:first" );

                        container.find( "div.pane.left:first" )
                                .slide( {

                                        selector4trigger: "small:first",
                                        selector4content: container.find( "div.pane.left:first" ),
                                        init: function( $node ) {

                                                var settings = this.settings;

                                                workspaceRight.data( "originalWidth", workspaceRight[ 0 ][ "style" ][ "width" ] );

                                                if ( $node.is( "." + settings.class4close ) ) {
                                                        $node.css( "width", "96%" );
                                                }

                                        },
                                        onClose: function() {

                                                var originalWidth = workspaceRight.data( "originalWidth" );

                                                workspaceRight.animate( { "width": "96%" }, 377 ); 
                                        },
                                        onOpen: function() {

                                                var originalWidth = workspaceRight.data( "originalWidth" );

                                                workspaceRight.animate( { "width": originalWidth }, 77 );
                                        }
                                } );
                },

                "progress": function( container, promise ) {
                
                        var 
                        progress = $( ".progress:first" ).progress().start(),
                        hanlder = function() { progress.done(); };

                        promise.always( function() { progress.done(); } );

                        if ( window.addEventListener ) {
                                container[ 0 ].addEventListener( "DOMNodeRemoved", hanlder );
                        } else container[ 0 ].attachEvent( "DOMNodeRemoved", hanlder );
                },

                "spinner": function( container, promise ) {

                        var spinner = "<div style='width: 18px;" +
                                "height: 18px;" +
                                "box-sizing: border-box;" +
                                "border: solid 2px transparent;" +
                                "border-top-color: #29d;" +
                                "border-left-color: #29d;" +
                                "border-radius: 50%;" +
                                "position: absolute;" +
                                "-webkit-animation: progress-spinner 400ms linear infinite;" +
                                "animation: progress-spinner 400ms linear infinite;" +
                                "'>";
                        /**
                        spinner = $( spinner )
                                .css( {
                                        top: 15,
                                        right: 15
                                } )
                                .appendTo( container );

                        promise.always( function() {
                                spinner.remove();
                        } );
                        */
                },
    
                "slide": function( container ) {

                        container.find( ".ui.slide" )
                                .each( function() {
                                        $( this ).slide( {

                                                selector4content: ".ui.slide.content:first",
                                                onClose: function() {

                                                        var self = this;

                                                        if ( !self.inAnimate ) {
                                                                self.inAnimate = 1;

                                                                self.$node.find( self.settings.selector4content )
                                                                .slideUp( function() {
                                                                        self.inAnimate = 0;
                                                                } );
                                                        }
                                                },

                                                onOpen: function() {

                                                        var self = this;

                                                        self.inAnimate 
                                                                || (self.inAnimate = 1, 
                                                                                self.$node.find( self.settings.selector4content )
                                                                                .slideDown( function() {
                                                                                        self.inAnimate = 0;
                                                                                } ));
                                                }
                                        } );
                                } );
                }
	};
	
        return function( container, eles, shim ) {

                var 
                args = {}, 
                promise,
                callbackWrap = function( callback, target ) {
                        return function() {
                                "function" === typeof callback && callback( target );
                        };
                },
                waiting = [];

                container = $( container );

                var shims = $.extend( {}, defaultShims, shim || {} );

                for ( var name in eles ) {

                        var target = eles[ name ][ "target" ], implement;

                        if ( reserved.indexOf( name ) === -1 && target ) {

                                if ( !(target instanceof window.jQuery) ) {
                                        target = $( target );
                                }

                                if ( target.length ) {

                                        var plugin;

                                        implement = hook[ target.attr( "data-role" ) ];

                                        plugin = implement( target, eles[ name ][ "options" ] );

                                        if ( name.indexOf( ":" ) ) {
                                                args[ name ] = plugin.instance;
                                        }

                                        $.when( plugin.promise )
                                        .done( callbackWrap( eles[ name ].done, target ) )
                                        .fail( callbackWrap( eles[ name ].fail, target ) )
                                        .always( callbackWrap( eles[ name ].always, target ) );

                                        waiting.push( plugin.promise );
                                }
                        }
                }

                promise = $.when.apply( $, waiting );

                for ( var shim in shims ) {

                        var callback = shims[ shim ];
                        typeof callback === "function" && callback( container, promise, waiting );
                }

                args.waiting = function() {
                        return promise;
                };

                return args;
        };
} );

