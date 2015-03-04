
define( [ "slick/paging/Paging",
                "slick/plugins/Checkboxcolumn",
		"slick/plugins/Radiocolumn" ], function( Paging, Checkboxcolumn, Radiocolumn ) {

	var
	
	namespace = "$ui.dialog",

	Dialog = function( target, settings ) {

		var 
		self = this,
                input = target.find( settings.selector4input ),
		trigger = target.find( settings.selector4trigger ),
                autoComplete = settings.autoComplete;

		this.$node = target;
		this.settings = settings;

		input.attr( "name", target.attr( "name" ) );

		trigger.on( "click", function( e ) {
			
			if ( target.is( "[disabled]" ) 
				|| ("function" === typeof settings.init && settings.init() === false) ) { 
				return; 
			}

			$.amodal( {
				title: settings.title || "Dialog",
				showButtons: false,
				closeByDocument: settings.closeByDocument,
				css: settings.css,

				selector4drag: settings.selector4drag,

				render: function( ready, loading, close ) {
					
					var $G;

					this
				        .addClass( "slickgrid-dialog" )
					.html( "<header>" + 
							"<input type='text' class='ui text' name='" + settings.key + "' placeholder='Please enter search keywrods'>" +
							"<button name='search' class='ui button transition primary'><i class='icon search'></i></button>" +
							"<button name='filter' class='ui button transition'><i class='icon filter'></i></button>" +
						"</header>" +
						"<section class='content'>" +
							"<div class='ui slickgrid' style='width:99%;'>" +
								"<div class='slickgrid' style='width:100%;height:410px;'></div>" +
							"</div>" +
						"</section>" +
						"<sction class='action'>" + 
							"<button name='ok' class='ui button transition success'>Ok</button>" +
							"<button name='close' class='ui button transition'>Cancel</button>" +
						"</section>" );
					
					$G = new Slick.Grid( this.find( ".slickgrid:last" ), new Slick.Data.DataView( settings.uniqueKey ), [], $.extend( {}, {
						forceFitColumns: settings.forceFitColumns,
						enableHeaderRow: true,
                                                enableColumnReorder: false,
						explicitInitialization: true
					}, settings.gridOptions ) );

					$G.setColumns( [ settings.multiple ? Checkboxcolumn( $G ) : Radiocolumn( $G ) ].concat( settings.columns ) );

					Paging( $G, $G.getData(), {
					
						pagingInfo: settings.pagingInfo,

						ajaxOptions: settings.ajaxOptions,

						increment: settings.increment,

					        autoSearch: settings.autoSearch,

                                                switcher: settings.switcher,

                                                fastMode: settings.fastMode
					} );

                                        /** After the DOM has been rendered */
                                        setTimeout( function() { $G.init(); } );

                                        !settings.multiple && $G.onDblClick.subscribe( function( e ) {

						var 
						data = $G.getRadioRow(),
						callback = settings.onOk;

						if ( "function" === typeof callback && false === callback.call( input, data, $G ) ) { return; }

						autoComplete && self.$autoComplete.val( [data] );
                                                input.trigger( "change" );
						close();
						e.stopImmediatePropagation();
					} );

					this

					.delegate( "button[name=search]", "click", function() {

                                                var params = {};

                                                params[ settings.key ] = $( this ).prev().val();

						$G.search( {
							params: params
						} );
					} )

					.delegate( "button[name=filter]", "click", function() {
						/** Toggle filter bar */
						$G.toggleHeaderRow();
					} )

					.delegate( "button[name=ok]", "click", function() {
					
						var
						data = settings.multiple ? $G.getSelectedRowsData() : [ $G.getRadioRow() ],
						callback = settings.onOk;

						if ( typeof callback === "function" 
						        && false === callback.call( input
						                        , data
						                        , $G ) ) {
						        return;
						}

						if ( autoComplete ) {
							self.$autoComplete.val( data );
						}

						input.trigger( "change" );
						close();
					} )

					.delegate( "button[name=close]", "click", function() {
					
						var callback = settings.onClose;

						"function" === typeof callback && callback.call( this, $G );

						close();
					} )

					.delegate( ":text[name='" + settings.key + "']", "keyup", function( e ) {
						
						if ( e.keyCode === 13 ) {
						        
						        var params = {};

						        params[ this.name ] = this.value;

						        $G.search( { params: params } );
						}

						e.preventDefault();
					} )

					.find( ".slick-wrap" ).removeClass( "out" );

					ready.resolve();
				}
			} );

			e.preventDefault();
		} );

                if ( autoComplete ) {

                	if ( "function" !== typeof autoComplete.set ) {
                		
                		autoComplete.set = function( item, settings ) {
                			
                			var values = [];

                			for ( var i = 0, length = item.length; i < length; ++i ) {
                				values.push( item[i][ settings.valueKey ] );
                			}

                			this.find( settings.selector4input ).attr( "data-value", values.join() );
                		}
                	}

			autoComplete.delimiter = !settings.multiple;
                        
                        this.$autoComplete = target.yoursComplete( $.extend( {},
                                                autoComplete, 
                                                { ajaxOptions: settings.ajaxOptions } ) );
                }
	};

	Dialog.prototype = {
		
		val: function( value ) {
			
			var input = this.$node.find( ":input" );

			if ( value ) {
				input.val( value );
			} else {
				return input.val();
			}
		},

		disabled: function() {
		        this.$node.attr( "disabled", true );
		},

		enabled: function() {
			this.$node.removeAttr( "disabled" );
		},

		focus: function() {
			this.$node.find( this.settings.selector4input ).select().focus();
		}
	};

	$.fn.dialog = function( options, force ) {
	
		var instance = this.data( namespace );

		if ( !0 === force || !instance ) {

			instance = new Dialog( this, $.extend( {}, $.fn.dialog.defaults, options || {} ) );
			this.data( namespace, instance );
		} 

		return instance;
	};

	$.fn.dialog.defaults = {
	
		css 		: { width: 800 },

		init 		: undefined,

		selector4drag 	: ".title:first",

		closeByDocument : true,

                forceFitColumns : true,

                key 		: "find",

                uniqueKey 	: "rr",

		pagingInfo 	: {
			pageSize: 100,
			pageNum : 0,

			sizes 	: [ 20, 50, 100, 1000 ]
		},

                autoSearch 	: true,

                fastMode 	: true,

                switcher 	: true,

                multiple 	: false,

                increment 	: false,

		selector4input 	: "input:first",
		selector4trigger: ".icon:first",

		autoComplete 	: false
	};
} );

