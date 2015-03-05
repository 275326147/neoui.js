
define( function() {
	
	"use strict";

	var defaults = {
		
		columnId: "_radio_selector",
		cssClass: "slick-cell-radio",
		width: 35,
		autoSelected: true,
                duplicate: false,
                frozen: true,
		
		key: "radio-select",
		cssCellClass: "slick-radio-row"
	}

	, RadioSelectColumn = function( $G, settings ) {
	
		var 
	        handler = new Slick.EventHandler(),
		dataView = $G.getData(),
		current = {
			
			row: undefined,
			id: undefined
		};

		$.extend( this, {
			
			init: function() {

				handler
					.subscribe( $G.getData().onPagingInfoChanged, function( e, args ) {
						
						if ( args.doSearch ) {
						
							/** Clear */
							current.row !== undefined && $G.invalidateRow( current );
							current = {};
						}
					} )
		
					.subscribe( $G.onClick, function( e, args ) {

						var cell = $G.getCellFromEvent( e );

						if ( cell ) {
							
							if ( settings.autoSelected ||
								($( $G.getCellNode( cell.row, cell.cell ) ).is( "." + settings.cssClass )) ) {
								
                                                                        setRadioRow( cell );
								}
						}
					} )
					
					.subscribe( $G.onCellCssStylesChanged, function( e, args ) {
						args.key === settings.key && sync();
					} )

					.subscribe( dataView.onRowsChanged, sync )
					.subscribe( dataView.onRowCountChanged, sync );
			},

			destroy: function() {
				
				handler.unsubscribeAll();
			},

			getColumnDefinifion: function() {
				
				return {

					id: settings.columnId,
					name: "",
					width: settings.width,
					resizable: false,
					sortable: false,
					frozen: settings.frozen,
					cssClass: settings.cssClass,
					formatter: function( row, cell, value, column, dataContext ) {
						
						return current.id === dataContext[ dataView.getIdProperty() ]
							
							? "<input type='checkbox' checked='checked'><label class='toggle'></label>"
							: "<input type='checkbox'><label class='toggle'></label>";
					}

				};
			}
		} );

		$.extend( $G, {

			onRadioRow: new Slick.Event(),
			
			getRadioRow: function() {
				
				if ( current.id ) {
					return dataView.getItemById( current.id );
				}
			},
			setRadioRow: setRadioRow
		} );

		function setRadioRow( cell ) {
		
			var editor;

			if ( cell === undefined ) {

                                $G.setCellCssStyles( settings.key, {}, true );
                                $G.invalidateRow( current.row );
                                current = {};
                                $G.render();
                                return;
			}

			if ( "number" === typeof cell ) {
			        
			        cell = {
                                        row: cell,
                                        cell: 0
			        };
			}

			if ( cell.row < $G.getDataLength() || settings.duplicate === true  ) {

				editor = $G.getEditorLock();

				editor.isActive( $G.getEditController() ) && editor.commitCurrentEdit();
				
				/** Don't interrupt 'dblclick' */

				if ( settings.duplicate !== true ) {
					if ( current.row !== cell.row ) {
					
						$G.invalidateRow( current.row );

						sync( current = {
							
							row: cell.row,
							id: $G.getDataItem( cell.row )[ dataView.getIdProperty() ]
						} );
					}
				}
                                $G.onRadioRow.notify( cell );
			}
		}

                function sync() {
                
                        var idxById, id, hash = {};

                        if ( current.id !== undefined ) {
                        
                                idxById = dataView.getSnapshot();
                                id = idxById[ current.id ];
                                
                                $G.getColumns().forEach( function( column ) {
                                        
                                        hash[ id ] = hash[ id ] || {};
                                        hash[ id ][ column.id ] = settings.cssCellClass;
                                } );

                                /** Don't trigger 'onCellCssStylesChanged' */
                                $G.setCellCssStyles( settings.key, hash, true );
                                $G.invalidateRow( current.row );
                                $G.render();
                        }
                }
	};

	return function( $G, options ) {

		var plugin = new RadioSelectColumn( $G, $.extend( {}, defaults, options || {} ) );

		$G.registerPlugin( plugin );

		return plugin.getColumnDefinifion();
	};
} );

