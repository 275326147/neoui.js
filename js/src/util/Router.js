
define( [ "util/Storage" ], function( Storage ) {
	
	var 

	noop = function() {},

	defaults = {
	
		injection: "#canvas",
		matched: /\w+/i,
		
		before: noop,
		after: noop,

		process: function( hash ) {
			
			return $.ajax( {
				url: "/views/" + hash + ".html",
				dataType: "html"
			} );
		}
	},

	mappings = { },

	hashchange = function( e ) {
	
		var hash = window.location.hash.substr( 1 );

		for ( var key in mappings ) {
			
			var 
			response,
                        deferred = $.Deferred(),
			config = mappings[ key ];

			if ( new RegExp( config.matched ).test( hash ) ) {

			        var data = Storage.get( hash );

				config.before( config );

                                if ( data ) {
                                        response = data;
                                } else {
                                        response = config
                                                .process( hash )
                                                .done( function( data ) {
                                                        Storage.set( hash, data );
                                                } );
                                }

				config.after( config, response );

				process( config, response );

				if ( e ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
			}
		}
	};

	function process( config, response ) {
	
		var injection;

		if ( typeof config.injection === "function" ) {
			injection = config.injection();
		} else 
			injection = $( config.injection );

		injection.css( "opacity", 0 ).addClass( "fade out" );

                $.when( response )
                .done( function( data ) {
                
                        data = typeof response === "string" ? response : data;

			injection.html( data );

			document.body.scrollTop = 0;

			setTimeout( function() {
				injection.css( "opacity", "" ).removeClass( "out" );
			}, 300 );
		} )
		.fail( function( data ) {

			if ( +data.status === 404 ) {
				location.href = "/404.html";
			}
		} );
	}

	function register( item ) {
	

		var items = item instanceof Array ? item : [ item ];

		for ( var i = 0, length = items.length; i < length; ++i ) {
		
			mappings[ item[ i ].name ] = $.extend( {}, defaults, item[ i ].config );
		}

	}

	register( [ {
	
		name: "1.wiki",

		config: {
			matched: /^wiki(\/)?$/i
		}
	}, {
		name: "2.page",

		config: {
		
			matched: /\w+/i,
			process: function( hash ) {
				
				return $.ajax( {
					url: "/views/" + hash + ".html",
					dataType: "html"
				} );
			}
		}
	}, {
		name: "3.home",

		config: {
			matched: /\s*/,

			process: function() {
				
				return $.ajax( {
					url: "/views/home.html",
					dataType: "html"
				} );
			}
		}
	} ] );

	$( window ).off( "hashchange", hashchange ).on( "hashchange", hashchange );

	$( function() {
		hashchange();
	} );

});
