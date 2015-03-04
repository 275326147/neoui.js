
( function( $ ) {
	
	var 

	NTree = function( target, settings ) {
		var
		deferred,
		selected,
		cache = [],
                hash = {},
                self = this,
		data = settings.data;

		this.$node = target;
		this.settings = settings;

		if ( !data ) {
			if ( settings.service ) {
				var service = settings.service;

				deferred = $.Deferred();

				$.ajax( {
					data: {
						name: service.serviceName,
						params: JSON.stringify( service.params )
					}
				} )
				.done( function( data ) {
					data = eval( "(" + data + ")" ).result;
					data = JSON.parse( data[ service.moduleName ] );
					
					deferred.resolveWith( data );
				} );
			} else {
				"function" === typeof settings.dataProxy && (deferred = settings.dataProxy());
			}
		}

		$.when( deferred ).done( function() {
			
			var node = $( "<ul>" );

			data = data || this;

			if ( !(data instanceof Array) && data.result instanceof Array ) {
			        data = data.result;
			}

                        /** Filter support */
			settings.data = ([].concat( data ));

                        renderTree( node, data, settings, hash, true );

                        target.find( settings.selector4content ).html( node.html() );
		} );

		var
                inHandle = false,
                delay = settings.duration + 100,
                timer;

		target
                .undelegate( "li[data-level]", "click.ntree" )
                .delegate( "li[data-level]", "click.ntree", function( e ) {

                        e.stopPropagation();
                        e.preventDefault();

                        if ( !inHandle ) {
                        
                                var 
                                self = $( this ),
                                duration = settings.duration,
                                operation = self.hasClass( "open" ) ? function() { close( self, duration ); } : function() { open( self, duration ); };

                                inHandle = 1;

                                if ( settings.closeSameLevel ) {

                                        var 
                                        level = self.attr( "data-level" ),
                                        recent = cache[ level ];

                                        cache[ level ] = self;
                                        recent && recent.get( 0 ) !== this && close( recent );
                                }

                                if ( $( e.target ).is( "span" ) ) {
                                
                                        selected && selected.removeClass( "selected" );
                                        selected = self.addClass( "selected" );

                                        clearTimeout( timer );

                                        timer = setTimeout( function() {
                                                "function" === typeof settings.callback && settings.callback.call( self, e, hash[ self.attr( "data-key" ) ], hash, level );
                                        }, delay );
                                } else {

                                        operation();
                                }

                                setTimeout( function() {
                                
                                        /** Unlock operation */
                                        target.resize();
                                        inHandle = 0; 
                                }, delay );
                        }
		} );

                var timer;

		target.find( settings.selector4filter ).on( "keyup", function( e ) {
		        
		        var value = this.value;

		        clearTimeout( timer );

		        timer = setTimeout( function() {
                                self.filter( value );
		        }, 300 );
		} );
	},
        namespace = "$ui.ntree"
	;

	function close( target, duration ) {
	
	        var post = function() {
                        $( this ).css( "display", "" ).parent().removeClass( "open" ).addClass( "close" ).css( "display", "" );
	        };

                /** Close all the children */
                if ( target.hasClass( "open" ) ) {
                
                        if ( duration ) {
                        
                                target.find( "ul[style='display: block;']" ).slideToggle( duration, function() {
                                        post.call( this );
                                } );
                        } else {

                                /** Disable animate */
                                target.find( "ul[style='display: block;']" ).each( function() {
                                        post.call( this );
                                } );
                        }
                }
	}

	function open( target, duration ) {
	
                if ( target.hasClass( "close" ) ) {
                
                        target.find( "ul:first" ).slideToggle( duration || 0, function() {
                                target.removeClass( "close" ).addClass( "open" );
                        } );
                }
	}

	NTree.prototype = {
		toggle: function( nodeid ) {
		
		},

		collapsed: function( nodeid ) {
		
		},

		expand: function( nodeid ) {
		
		},

                filter: function( text ) {
                
                        /** Prevent multiple reflow */
                        var 
                        matched,
                        settings = this.settings,
                        node = this.$node.css( "display", "none" ),
                        lis = node.find( "li[data-filter]" ).css( "display", "" );

                        /** Close all parent node */
                        lis.filter( "li.open" ).each( function() {
                                close( $( this ) );
                        } );

                        if ( text ) {
                                matched = lis.filter( "[data-filter*='" + text.toLowerCase() + "']" );
                                lis.not( matched ).css( "display", "none" );

                                matched.each( function() {
                                        
                                        var self = $( this );

                                        if ( !self.find( "li[data-level][style!='display: none;']" ).length ) {
                                                
                                                /** Show the subitem */
                                                self.find( "li[data-level]" ).css( "display", "" );
                                        }

                                        /** Expand the matched node */
                                        self.parents( "li[data-filter]" ).each( function() {
                                                open( $( this ).show() );
                                        } );
                                } );
                        }

                        node.css( "display", "" );
                }
	};

	function renderTree( node, data, settings, hash, recursion ) {
	
		var 
		html = "",
		key = node.attr( "data-key" ) || settings.rootIds,
		level = +node.attr( "data-level" ) || 0,
		filter = settings.filter[ level ] || function() { return true; };

		data = data instanceof Array ? data : [ data ];
		key = key instanceof Array ? key : [ key ];

		for ( var i = 0, length = data.length; i < length; ++i ) {
			
			var item = data[ i ];

			hash[ item[ settings.valueKey ] ] = item;

			/** Match undefined */
			if ( key[ 0 ] === (item[ settings.parentKey ] || "")
					|| key.indexOf( item[ settings.parentKey ] ) !== -1 ) {
					
				/** Remove this entry and fallback the step */
				--length;
				data.splice( i--, 1 );

				if ( filter( item ) ) {
                                        html += settings.render( item, level + 1, settings );
				}
			}
		}

		if ( html ) {
		
			html = $( "<ul>" + html + "</ul>" );

			recursion && html.children( "li[data-level]" ).each( function( item ) {
				renderTree( $( this ), data, settings, hash, true );
			} );

			node.append( "<ul>" + html.html() + "</ul>" );
		} else {
		        node.removeClass( "node open close" );
		}
	}

	$.fn.ntree = function( options ) {
	
		var instance = this.data( namespace );

		if ( !instance ) {
			instance = new NTree( this, $.extend( {}, $.fn.ntree.defaults, options || {} ) );
			this.data( namespace, instance );
		}
		
		return instance;
	};

	$.fn.ntree.defaults = {
	
		rootIds         : "",

		parentKey       : "parentId",
		textKey         : "text",
		valueKey        : "value",

		/** Start with collapsed menu( only level 1 items visible ) */
		collapsed       : true,

		/** Close element on same level when open new node */
		closeSameLevel  : false,

		/** Animation duration should be tweaked according to easing */
		duration        : 200,

		selector4content: ".content",
		selector4filter : "input[name=filter]",

                /** A local array */
		data            : undefined,

		filter          : {},

		/**
		 * WPF service implementation
		 *
		 * {
		 * 	@param name 	        String
		 * 	@param [params] 	String
		 * 	@param [module] 	String
		 * }
		 * */
		service         : undefined,

		/** Return a promise */
		dataProxy       : undefined,

		render: function( item, level, settings ) {
			
			return "<li class='node " + (settings.collapsed ? "close" : "open") + 
			        "' value='" + item[ settings.valueKey ] + 
			        "' data-filter='" + item[ settings.textKey ][ "toLowerCase" ]() +
			        "' data-level=" + level + " data-key='" + item[ settings.valueKey ] + 
			        "'><a style='padding-left: " + ((level - 1) * 3) + "em;'><i class='icon'></i><span>" + item[ settings.textKey ] + "</span></a></li>";
		}
	};

} )( window.jQuery );
