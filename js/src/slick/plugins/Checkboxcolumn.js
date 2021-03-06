define( [ "slick/plugins/RowsModel" ], function( RowsModel ) {

	"use strict";

	var defaults = {
		columnId : "_checkbox_selector",
		tooltip: "Select/Deselect All",
		cssClass: "slick-cell-checkbox",
                frozen: true,
		width: 35
	}

	/** CLASS */
	, CheckboxSelectColumn = function( $G, settings ) {
	
		var handler = new Slick.EventHandler()

		/** Cache the selected items */
		, selecteds = {}

		, instance = {
		
			init: function() {

				handler
					.subscribe( $G.onSelectedRowsChanged, handleSelectedRowsChanged )
					.subscribe( $G.onClick, handleClick )
					.subscribe( $G.onHeaderClick, handleHeaderClick );
			},

			destroy: function() {
				handler.unsubscribeAll();
			},

			getColumnDefinifion: function() {
			
				return {
					id: settings.columnId,
					name: "<input type='checkbox'><label class='toggle'></label>",
					tooltip: settings.tooltip,
					width: settings.width,
					frozen: settings.frozen,
					resizable: false,
					sortable: false,
					cssClass: settings.cssClass,
					formatter: function( row, cell, value, column, dataContext ) {

						var condition = settings.condition, res = true;

						if ( dataContext ) {

							if ( "function" === typeof condition ) {
							
								res = condition.apply( this, arguments );
							}

							return res && selecteds[ row ] 
								? "<input type='checkbox' checked='checked'><label class='toggle'></label>"
								: "<input type='checkbox'><label class='toggle'></label>";
						}
					}
				};
			}
		};

		function handleSelectedRowsChanged( e, args ) {
		
			var lookup = {}, rows = $G.getSelectedRows();

			for ( var i = 0, row, length = rows.length; i < length; ) {
				
				row = rows[ i++ ];
				lookup[ row ] = true;

				if ( lookup[ row ] !== selecteds[ row ] ) {
					$G.invalidateRow( row );
					delete selecteds[ row ];
				}
			}

			for ( i in selecteds ) {
				$G.invalidateRow( i );
			}

			selecteds = lookup;

			$G.render();

			$G.updateColumnHeader( settings.columnId
						, rows.length && rows.length === $G.getDataLength() ? "<input type='checkbox' checked='checked'><label class='toggle'></label>" : "<input type='checkbox'><label class='toggle'></label>"
						, settings.tooltip );
		}

		function handleClick( e, args ) {

			var toggleRowSelection = function( row ) {
			
				if ( selecteds[ row ] ) {
					$G.setSelectedRows( $.grep( $G.getSelectedRows(), function( index ) {
						
						return index !== row;
					} ) );
				} else {
					$G.setSelectedRows( $G.getSelectedRows().concat( row ) );
				}
			};
		
			if ( $G.getColumns()[ args.cell ][ "id" ] === settings.columnId ) {

				/** If editing, try to commit */
				if ( $G.getEditorLock().isActive() && !$G.getEditorLock().commitCurrentEdit() ) {

					e.preventDefault();
					e.stopImmediatePropagation();
					return;
				}

				toggleRowSelection( args.row );
			}
		}

		function handleHeaderClick( e, args ) {

			if ( args.column.id !== settings.columnId ||

					/** If editing, try to commit and return */
					($G.getEditorLock().isActive() && !$G.getEditorLock().commitCurrentEdit()) ) { 

						e.preventDefault();
						e.stopImmediatePropagation();
						return; 
					}

			/** Select all */
			if ( !$( e.target ).prev().is( ":checked" ) ) {
				
				var rows = [];

				for ( var i = 0, length = $G.getDataLength(); i < length; rows.push( i++ ) );

				$G.setSelectedRows( rows );

			/** Deselect */
			} else {
				$G.setSelectedRows( [] );
			}

			e.preventDefault();
			e.stopImmediatePropagation();
		}

		$.extend( this, instance );

		$.extend( $G, {
                        selectedAllRows: function() {

                                var rows = [];

                                for ( var i = $G.getDataLength(); --i >= 0; rows[ i ] = i );

                                $G.setSelectedRows( rows );
                        }
		} );
	};

	return function( $G, options ) {
	
		var
		  settings = $.extend( {}, defaults, options || {} ),
		  plugin = new CheckboxSelectColumn( $G, settings );

		/** Enable rows selected ability */
		$G.setSelectionModel( RowsModel( $G ) );

		/** Register plugin */
		$G.registerPlugin( plugin );

		/** Return the column definition */
		return plugin.getColumnDefinifion();
	};
} );

