
define( function() {
	
	"use strict";

	var 
	  handleSort = function( e, args ) {
	  
		var 
                field = args.sortCol.field,
		dataView = this.getData();

		dataView.beginUpdate();

		dataView.sort( function( a, b ) {
			var x = a[ field ], y = b[ field ];
			return (x === y ? 0 : (x > y ? 1 : -1));
		}, args.sortAsc );

		dataView.endUpdate();
	  };

	return function( $G, enable ) {

		var pager;

		if ( $G && true === enable ) {

			pager = $G.getData().setPagingOptions;
			
			$G.onSort.unsubscribe( handleSort );
			$G.onSort.subscribe( handleSort );
		} else {
		
			$G.onSort.unsubscribe( handleSort );
		}

		return pager;
	};
} );

