
define( [ "ui/YoursComplete" , "ui/Calendar"], function() {

	"use strict";

	var getSort = function() {
		
		var sortColumn = this.getSortColumns()[ 0 ], column;

		if ( !sortColumn ) {
		
			return {};
		}
		
		column = this.getColumns()[ this.getColumnIndex( sortColumn.columnId ) ];

		return {
			remoteSortField: column.field,
			remoteSortOrder: sortColumn.sortAsc ? "asc" : "desc"
		};
	};
	
	var autoComplete = function(e, args, column){
		var node = $( args.node ).html( "<div class='ui yoursComplete'>" +
							"<input type='text' class='front' data-column-field='" + column.field + "' placeholder='' />" +
							"<input type='text' class='hint' tabindex='-1' />" +
							"<i class='icon arrow down'></i>" +
							"</div>" );

		node.find( ".ui.yoursComplete" ).yoursComplete( $.extend( {}, {
			minChars: 0,
			inputAnything: false,
			set: function( items, settings ) {
				
				var values = [];

				for ( var i = 0, length = items.length; i < length;
					values.push( items[i++][ settings.valueKey ] ) );

				this
				.find( settings.selector4input )
				.attr( "data-value", values.join() )
				.trigger( "change" );
			}
		}, column.filterOptions ) );
	};
	
	var calendar = function(e, args, column){
		/*
		 + "<div style='width:100%;text-align:center;background:rgb(238, 238, 238);'>TO</div>" +
							"<div class='ui calendar' style='width:100%;'><input class='ui text' type='text'><i class='icon calendar'></i></div>"
		*/
		$( args.node ).html( "<div class='ui calendar' style='width:100%;'>" +
							"<input type='text' class='ui text' data-column-field='" + column.field + "' placeholder='' />" +
							"<i class='icon calendar'></i>" +
							"</div>")
							.find( ".ui.calendar" ).calendar();
	};
	
	var select = function(e, args, column){
		var
			html = "",
			options = column.filterOptions,
			items = options.items,
			node = $( args.node ).html( "<label class='ui select'><select data-column-field='" + column.field + "'></select></label>" );

			for ( var i = 0, length = items.length; i < length; ++i ) {
				
				var
				item = items[i],
				value = item[ options.valueKey ],
				text = item[ options.textKey ];

				html += "<option value='" + (value || text) + "'>" + text + "</option>";
			}

			node.find( "select" ).html( html );
	};

	return function( $G, fastQuery ) {
	
		var 
		dataView = $G.getData(),
		bar = $( $G.getHeaderRow() ),
		options = $G.getOptions(),
		filters = {};
	
		$G.onHeaderRowCellRendered.subscribe( function( e, args ) {

			var column = args.column;
		
			if ( args.column.filter ) {

				switch ( column.filter ) {
					
					case "autoComplete":
						autoComplete( e, args, column )
						break;
					
					case "calendar":
						calendar( e, args, column )
						break;
						
					case "select":
						select( e, args, column )
						break;

					default:
						$( args.node ).html( "<input type='text' data-column-field='" + column.field + "' placeholder='' >" );
				}
			} else if ( column.id === "_checkbox_selector" ) {
				$( args.node ).html( "<button class='icon slick-filter-clear' title='Clear the filter'></button>" );
			}
			
										
			$( args.node ).undelegate("focus").undelegate("focusout")
				
				.delegate("div,input,i","focus",function(e){
					$( args.node ).parents().find(".slick-headerrow-columns").css("overflow","visible");
					$( args.node ).parents().find(".slick-headerrow-columns-right").css("overflow","visible");
				})
				
				.delegate("div,input,i","focusout",function(e){
					$( args.node ).parents().find(".slick-headerrow-columns").css("overflow","hidden");
					$( args.node ).parents().find(".slick-headerrow-columns-right").css("overflow","hidden");
				});
		} );

		/** Set the filter */
		dataView.setFilter( function( row, args ) {
			
			var value, idProperty = dataView.getIdProperty();

			if ( row[ "_indent_" ] && !row[ "_expand_" ] ) {
			        return false;
			}

			/** Skip the new line */
			if ( row[ "_isNew" ] ) { return true; }

			if ( ( options.alwaysUpdateRows && $G.getUpdateRowsID && $G.getUpdateRowsID()[ row[ idProperty ] ] ) 
				|| ( options.alwaysDeleteRows && $G.getDeleteRowsID && $G.getDeleteRowsID()[ row[ idProperty ] ] ) ) {
					
					return true;
				}

			for ( var field in filters ) {

				value = filters[ field ];

				if ( value 
					/** Fuzzy search */
					&& (row[ field ] || "").toString().toLowerCase().indexOf( value.toLowerCase() ) === -1 ) {
					return false;
				}
			}

			return true;
		} );

		bar

		.delegate( "select, input:visible", "keyup change", function( e ) {
			
			var 
			self = $( this ),
			field = self.attr( "data-column-field" );

			if ( field ) {
				
				filters[ field ] = (self.attr( "data-value" ) || self.val()).replace( /^\s+|\s+$/g, "" );
				dataView.refresh();

				if ( (!fastQuery || fastQuery.is( ":checked" )) && 13 === e.keyCode ) {
					
					$G.search();
					e.stopPropagation();
				}
			}
		} )

		.delegate( "button.slick-filter-clear", "click", function( e ) {
		
			bar.find( "div.slick-headerrow-column input[data-column-field]" )

				.each( function() {
					$( this ).val( "" );
				} );

			filters = {};
			dataView.refresh();

			e.stopPropagation();
			e.preventDefault();
		} )
		
		.delegate( ".slick-headerrow-column", "click", function( e ) {
		
			$G.getEditorLock().isActive() && $G.getEditorLock().cancelCurrentEdit();

			e.stopPropagation();
		} );

	        $.extend( $G, {
	        
                        getConditions: function() {
                        
								var criteria = [], value;

								for ( var field in filters ) {
									
									(value = filters[ field ])

										&& criteria.push( {
											field: field,
											operator: "like",
											value: value
										} );
								}

								return {
									pageVO: (!fastQuery || fastQuery.is( ":checked" )) ? getSort.call( $G ) : {},

									params: { criteria: JSON.stringify( criteria ) }
								};
                        },

                        resetConditions: function() {
                                
                                bar.find( "div.slick-headerrow-column input[data-column-field]" )

                                        .each( function() {
                                                $( this ).val( "" );
                                        } );

                                filters = {};
                                $G.setSortColumns( [] );
                        }
	        } );
	};
} );
