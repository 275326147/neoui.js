
define( [ "slick/paging/Local", 
	"slick/paging/Remote",
	"slick/plugins/Loading",
	"slick/paging/Conditions" ], function( Local, Remote, Loading, Conditions ) {

	"use strict";

	var defaults = {
		
		container: undefined,

		autoSearch: true,
		switcher: true,
		fastMode: true,
                increment: false,

		pagingInfo: {
			pageSize: 20,
			pageNum: 0,

			sizes: [ 20, 50, 100 ]
		},

                tree: {
                
                },

                extraParams: {}
	};

	return function( $G, dataView, options ) {

		var settings = $.extend( {}, defaults, options || {} )
	
		, container = $( 
			"<div class='pager'>" +
				"<div class='left'>" +
					"<div class='nav'>" +
						"<button class='icon first' disabled></button>" +
						"<button class='icon prev' disabled></button>" +
						"<button class='icon next' " + (settings.increment ? "" : " disabled ") + "></button>" +
						"<button class='icon last' disabled></button>" +
					"</div>" +

					"<div class='info'>" +
						"<input type='text' class='current' maxlength='5' value='1'>" +
						"<button disabled='disabled' class='total'>1</button>" +
						"<span class='count'>0</span>" +
					"</div>" +
				"</div>" +

				"<div class='right'>" +

					(settings.switcher
					? ("<div style='display: inline-block;' class='ui tooltip top' data-tooltip='Order by Server or Local'>" +
                                                "<label class='ui switch'>" +
                                                "<input name='fastQuery' type='checkbox' " + (!settings.fastMode ? " checked " : "") + ">" +
                                                "</label>" +
					"</div>")  
					: "") +

					"<div class='icon refresh transition rotate'></div>" +

					"<div class='size'>" +
						"<label class='ui select'>" +
							"<select></select>" +
						"</label>" +
					"</div>" +
				"</div>" +
			"</div>" )

                , info = container.find( "div.info" )
                , nav = container.find( "div.nav" )
		, current = info.find( "input.current" )
		, total = info.find( "button.total" )
		, count = info.find( ".count" )
		, first = nav.find( ".icon.first" )
		, last = nav.find( ".icon.last" )
		, size = container.find( "select:first" )

		, ajaxOptions = options.ajaxOptions

		, incrementMaxSize = 0

		, lastInput

		/** Update the paging info to UI */
		, uiRefresh = function( pagingInfo ) {
		
			var 

			  prev = container.find( ".prev" ), 
			  next = container.find( ".next" ),

			  value, max;

                        if ( settings.increment ) {

                                if ( !incrementMaxSize ) {
                                
                                        if ( ~~pagingInfo.moreRows === 0 ) {
                                                max = incrementMaxSize = pagingInfo.totalPages;
                                        }
                                        else max = +pagingInfo.totalPages;
                                } else max = incrementMaxSize;
                        } else {
                                max = pagingInfo.totalPages || 1;
                        }

                        value = (pagingInfo.pageNum >= 0 && pagingInfo.pageNum < max) ? ++pagingInfo.pageNum : 1,

			/** Clear the last state, prevent has been disabled after the size change */
			prev.removeAttr( "disabled" ), next.removeAttr( "disabled" );

			(value < max && value > 1) && ( prev.removeAttr( "disabled" ), next.removeAttr( "disabled" ) );

			value <= 1 && prev.attr( "disabled", "disabled" );
			value === max && next.attr( "disabled", "disabled" );

			$G.resetActiveCell();

                        first.attr( "disabled", value === 1 );
                        last.attr( "disabled", value >= max );

			current.val( value );
			size.val( pagingInfo.pageSize );
			total.html( max ).attr( "data-total", max );

			count.html( pagingInfo.totalRows );
		}

		/** A function that implement for paging */
		, pager;

		Loading( $G );

		dataView.onRowCountChanged.subscribe( function() {
			$G.updateRowCount();
			$G.render();
		});

		dataView.onRowsChanged.subscribe( function( e, args ) {
			$G.invalidateRows( args.rows );
			$G.render();
		} );

		/** Prevent refresh dataview */
		dataView.beginUpdate();

		for ( var sizes = settings.pagingInfo.sizes, length = sizes.length, i = 0; i < length; ) {
			
			/** Right now DOM is not in the render tree, so there is no reflow */
			size.append( "<option value=" + sizes[ i ] + ">" + sizes[ i++ ] + "</option>" );
		}

		/** All operations on local */
		if ( !ajaxOptions ) {

			dataView.setItems( settings.data );
		
			/** Skip the first notify */
			dataView.setPagingOptions( settings.pagingInfo );

			dataView.onPagingInfoChanged.subscribe( function( e, args ) {

				if ( args.doSearch ) {

					pager( args.pagingInfo || {
						
                                                incrementalPaging: settings.increment,
						pageSize: +size.val(),
						pageNum: +current.val() - 1
					} );
				} else uiRefresh( dataView.getPagingInfo() );
			} );

			(pager = Local( $G, true ))( dataView.getPagingInfo() );
		} else {

			dataView.onPagingInfoChanged.subscribe( function( e, args ) {

				if ( args.doSearch ) {

                                        pager( {
                                                pageSize: +size.val(),
                                                incrementalPaging: settings.increment,
                                                /** In SCM the 'pageNum' start from 1, so you should specify an offset to patch it */
                                                pageNum: +current.val() + 1
                                        }, uiRefresh, $.extend( {}, $G.getConditions(), lastInput || {} ) )
					.done( function() {
					        
					        $G.setRadioRow && $G.setRadioRow();
					        $G.getSelectionModel() && $G.setSelectedRows && $G.setSelectedRows( [] );
					} )
					.done( settings.onAfterPaging );
				} else e.stopImmediatePropagation();
			} );

			pager = Remote( $G, settings.ajaxOptions, true );
			
			if ( true === settings.autoSearch ) {
				pager( settings.pagingInfo, uiRefresh )
				.done( settings.onAfterPaging );
			}
		}

		if ( ajaxOptions && settings.fastMode ) {
			Local( $G, true );
			Remote( $G, ajaxOptions, false );
		}

		/** This function will be cause a refresh */
		Conditions( $G, settings.switcher ? container.find( ":checkbox[name=fastQuery]" ) : false );

		/** Refresh dataview */
		dataView.endUpdate();

		container

		.delegate( ".prev", "click", function( e ) {
		
			e.stopImmediatePropagation();
			e.preventDefault();

			var value = +current.val() - 1;

			current.val( value >= 1 ? value : 1 );

			dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
		} )
		
		.delegate( ".next", "click", function( e ) {
		
			e.stopImmediatePropagation();
			e.preventDefault();

			var value = +current.val() + 1, max = +total.attr( "data-total" ) || 1;

			current.val( value <= max ? value : max );

			dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
		} )

                .delegate( ".icon.first, .icon.last", "click", function( e ) {
                        
                        e.stopImmediatePropagation();
                        e.preventDefault();

                        current.val( $( this ).hasClass( "first" ) ? 1 : +total.attr( "data-total" ) );

			dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
                } )
                
		.delegate( "select", "change", function( e ) {

			e.stopImmediatePropagation();

			incrementMaxSize = 0;

			current.add( total ).val( 1 );

			dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
		} )
		
		.delegate( "input.current", "keyup", function( e ) {

			var value = +current.val() || 1
			, max = +total.attr( "data-total" ) || 1;
			
			switch ( e.keyCode ) {
				
				case 38:
					++value <= max 
						? current.val( value ) 
						: --value;
					break;

				case 40:
					--value >= 1 
						? current.val( value ) 
						: ++value;
					break;

				case 13:

					if ( value <= max && value >= 1 ) {

						current.blur();

						dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
					} else {
						current.select();
					}
					break;
			}

			e.stopImmediatePropagation();
		} )

		.delegate( ":checkbox[name=fastQuery]", "click", function( e ) {
			
			if ( $( this ).is( ":checked" ) ) {
				
				Local( $G, false );
				Remote( $G, ajaxOptions, true );
			} else {
				Local( $G, true );
				Remote( $G, ajaxOptions, false );
			}
		} )
		
		.delegate( "div.refresh", "click", function( e ) {

			dataView.onPagingInfoChanged.notify( { doSearch: 1, reset: true } );

			e.stopPropagation();
		} );

		if ( $G.getOptions().keepSelection ) {
		
			$G.onCellCssStylesChnage.subscribe( function( e, args ) {
				$G.onSelectedRowsChanged.notify();
			} );
		} else $G.getSelectionModel() && $G.getData().syncGridSelection( $G );

		$( $G.getContainerNode() ).after( container );

		$.extend( $G, {
			
			search: function( args ) {

				var 
			        input = $G.getConditions(),
				extraParams = "function" === typeof settings.extraParams ? settings.extraParams() : settings.extraParams;

		                incrementMaxSize = 0;

				lastInput = args = args || {};

				$.extend( input.params, extraParams, (args.params instanceof Function ? args.params() : args.params) || {} );

				return pager( args.pagingInfo || {
					pageSize: +size.val(),
				       incrementalPaging: !!settings.increment,
					pageNum: 0
				}, uiRefresh, input )
				
				.done( function() {
                                        !$G.getOptions().keepSelection && $G.getSelectionModel() && $G.setSelectedRows( [] );
					$G.scrollRowToTop( 0 );
				} );
			},

			commit: function( args ) {

				var 
			        input = { params: {} },
				extraParams = "function" === typeof settings.extraParams ? settings.extraParams() : settings.extraParams;

				input.result = {
					result: {
						items2Create: JSON.stringify( $G.getAddRows ? $G.getAddRows() : [] ),
						items2Update: JSON.stringify( $G.getUpdateRows ? $G.getUpdateRows() : [] ),
						items2Delete: JSON.stringify( $G.getDeleteRows ? $G.getDeleteRows() : [] ),
						items2Selected: JSON.stringify( $G.getSelectedRow ? $G.getSelectedRows() : [] )
					}
				};

				args = args || {};

				$.extend( input.params, extraParams, (args.params instanceof Function ? args.params() : args.params) || {} );

                                /** RESET CURD DATA */
                                $G.setAddRows && $G.setAddRows( {} );
                                $G.setDeleteRows && $G.setDeleteRows( [] );
                                $G.setUpdateRows && $G.setUpdateRows( {} );
			
				return pager( args.pagingInfo || {
					pageSize: +size.val(),
					pageNum: 0
				}, uiRefresh, input )
				
				.done( function() {
                                        $G.resetGenius && $G.resetGenius();
                                        !$G.getOptions().keepSelection && $G.getSelectionModel() && $G.setSelectedRows( [] );
					$G.scrollRowToTop( 0 );
				} );
			}
		} );
	};
} );
