
define( [ "util/Storage", "ui/Amodal" ], function( Storage ) {

        "use strict";

	var defaults = {
	
		key: "unique",
		scope: "local",

		ignore: [ "_checkbox_selector", "_radio_selector", "idx" ]
	}

	, Lab = function( $G, settings ) {
		
		var 
	          config = Storage.get( settings.key, !!{ "session": 0, "local": 1 }[ settings.scope ] ),
		  mapping,
                  miscellaneous,

		  options = $G.getOptions(),
		  original = $G.getColumns();

		function applyConfig() {
		
			var columns = []; 

			for ( var id in mapping ) {
				
				var column, item = mapping[ id ];

				if ( mapping[ id ][ "always" ] | !mapping[ id ][ "hide" ] ) {

					var 
                                        index = +item[ "index" ],
					
					column = original[ +item[ "originalIndex" ] ];

					column.width = item[ "width" ];
					column.tooltip = item[ "tooltip" ];
					column.frozen = item[ "frozen" ];

					/** Column reorder */
					columns[ index ] = column;
				}
			}

			/** Remove array gap */
			for ( var _columns = [], i = columns.length; --i >= 0; columns[ i ] && _columns.unshift( columns[ i ] ) );

			$.extend( options, miscellaneous );

			try {
			
                                columns.length && $G.setColumns( _columns );
			} catch ( ex ) {

			        /** Resore columns */
			        $G.setColumns( original );
			        $.extend( options, miscellaneous );
                                Storage.remove( settings.key, settings.scope === "local" );
                                initialization();
			}
		}

		function updateConfig() {

                        mapping = {};

			for ( var i = 0, length = original.length; i < length; ++i ) {
				
				var column = original[ i ];
				
				mapping[ column.id ] = {
					name: column.name,
					originalWidth: column.width,
					width: column.width,
					always: settings.ignore.indexOf( column.id ) > -1,
					originalTooltip: column.tooltip,
					tooltip: column.tooltip,
					frozen: !!column.frozen,
					originalFrozen: !!column.frozen,
					hide: false,
					originalIndex: i,
					index: i
				};
			}

			config = {
			        
                                mapping: mapping,

                                miscellaneous: (miscellaneous = {
                                        alwaysDeleted: !!options.alwaysDeleted,
                                        alwaysUpdated: !!options.alwaysUpdated
                                }),

                                _miscellaneous_: JSON.parse( JSON.stringify( miscellaneous ) )
			};
		}

		function initialization() {
		
			mapping = {};

			updateConfig(); 
		}

		$G.onColumnsResized.subscribe( function( e, args ) {
			
			for ( var id in args.hash ) {
				mapping[ id ][ "width" ] = args.hash[ id ];
			}

			Storage.set( settings.key, config, { "session": false, "local": true }[ settings.scope ] );
		} );

		$G.onColumnsReordered.subscribe( function( e, args ) {
			
			var 
			from = args.hash[ 0 ], to = args.hash[ 1 ],
			fromIndex = mapping[ from.id ][ "index" ], toIndex = mapping[ to.id ][ "index" ];

			mapping[ from.id ][ "index" ] = toIndex;
			mapping[ to.id ][ "index" ] = fromIndex;

			/** Auto save config */
			Storage.set( settings.key, config, settings.scope === "local" );
		} );

		if ( config ) {
		        mapping = config.mapping;
		        miscellaneous = config.miscellaneous;

		        applyConfig();
		} 
                else initialization();

		$( settings.trigger ).on( "click", function() {

			var queue = {};
		
			$.amodal( {
				showButtons: false,
				closeByDocument: true,
				showHead: false,

				render: function( ready, loading, close ) {

					var self = this;

					self.load( "/views/lab.html", function() {

						var 
						html = "";

						for ( var id in mapping ) {

							var item = mapping[ id ];
							
							!item.always 
								&& (html += "<li data-id='" + id + "'>" + 
									"<div class='left'>" +
										"<h4>" + item.name + "</h4>" +
										"<input type='text' placeholder='Tooltip' name='tooltip' value='" + (item.tooltip || "") + "'>" +
									"</div>" +

                                                                        "<label class='ui checkbox tooltip top' data-tooltip='Frozen this column' >" +
                                                                                "<input type='checkbox' " + (item.frozen ? " checked " : " ") + " />" +
                                                                        "</label>" +

									"<a class='ui tooltip top' name='show' data-tooltip='Show column'><input name='show-hide-" + id + "' class='ui radio' type='radio' " + (item.hide ? " " : " checked " ) + " /></a>" + 
									"<a class='ui tooltip top' name='hide' data-tooltip='Hide column'><input name='show-hide-" + id + "' class='ui radio' type='radio' " + (item.hide ? " checked " : " ") + " /></a>" +
								"</li>");
						}
						
						self.find( "div.list" ).html( "<ul>" + html + "</ul>" );

						self.find( "[name=alwaysDeleted]" ).attr( "checked", miscellaneous.alwaysDeleted );
						self.find( "[name=alwaysUpdated]" ).attr( "checked", miscellaneous.alwaysUpdated );

						ready.resolve();
					} );

					self
						.delegate( "button[name=cancel]", "click", function() {
							
							queue = {};
							close();
						} )

						.delegate( "button[name=reset]", "click", function() {
						
							for ( var id in mapping ) {
								
								var item = mapping[ id ];

								item[ "hide" ] = false;

								$.extend( original[ item.originalIndex ], { 
									width: item.originalWidth,
									frozen: item.originalFrozen,
									tooltip: (item.originalTooltip || "")
								} );
							}

							close();

							$.extend( options, miscellaneous = JSON.parse( JSON.stringify( config[ "_miscellaneous_" ] ) ) );
							$G.setColumns( original );
							Storage.remove( settings.key, { "session": false, "local": true }[ settings.scope ] );
							updateConfig();
						} )

						.delegate( "button[name=save]", "click", function() {

							for ( var id in queue ) { 
							        
							        var item = queue[ id ];

							        if ( id === "miscellaneous" ) {
							                $.extend( miscellaneous, item );
							                continue;
							        }

							        $.extend( mapping[ id ], {
							        
                                                                        hide: item.hide,
                                                                        frozen: item.frozen,
                                                                        tooltip: item.tooltip
							        } );
							}
						
							close();
							applyConfig();
							Storage.set( settings.key, config, { "session": false, "local": true }[ settings.scope ] );
							queue = {};
						} )

						.delegate( "li[data-id] :radio, li[data-id] :checkbox", "click", function( e ) {
						
						        var 
						        self = $( this ),
						        id = self.parents( "li[data-id]" ).attr( "data-id" ),
						        item = queue[ id ] || {};

                                                        if ( self.is( ":checkbox" ) ) {
                                                                item.frozen = self.is( ":checked" );
                                                        } else {
                                                                item.hide = self.parent().is( "[name=hide]" );
                                                        }

                                                        queue[id] = item;
						} )
						
						.delegate( "li[data-id] :text[name=tooltip]", "change", function( e ) {
						
							var 
							self = $( this ),
						        id = self.parents( "li[data-id]" ),
							item = queue[ id ] || {};

                                                        item.tooltip = self.val();

                                                        queue[ id ] = item;
						} )
						
						.delegate( ":checkbox[name=alwaysUpdated], :checkbox[name=alwaysDeleted]", "click", function() {
							
							var 
						        item = queue[ "miscellaneous" ] || {};

                                                        if ( this.name === "alwaysUpdated" ) {
                                                                item.alwaysUpdated = !miscellaneous.alwaysUpdated;
                                                        } else {
                                                                item.alwaysDeleted = !miscellaneous.alwaysDeleted;
                                                        }

							queue[ "miscellaneous" ] = item;
						} );

					ready.resolve();
				}
			} );
		} );
	};

	return function( $G, options ) {

		var settings = $.extend( {}, defaults, options || {} );
		
		new Lab( $G, settings );
	};
} );
