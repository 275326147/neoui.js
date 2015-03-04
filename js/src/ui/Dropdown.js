
(function( $, undefined ) {
	
	"use strict";

	var 

	namespace = "$ui.dropdown",

	Dropdown = function( target, settings ) {
		
		var
		self = this,
	
		/** Shortcutts */
		title,
		content;

		target = $( target ).attr( "tabindex", 1 );

		this.$node = target;
		this.settings = settings;

		title = target.find( settings.selector4title );
		content = target.find( settings.selector4content );

		target

		.on( "focusout", function( e ) {
		
			setTimeout( function() {

                                if ( e.relatedTarget !== target[0] && !title.is( ":focus" ) ) {
                                        target.removeClass( "open" );
                                }
			}, 200 );
		} )

		/** Update the text */
		.on( "update.dropdown", function( e ) {
			
			var
			text = [],
			lis = content.find( "li.selected" );

			for ( var i = 0; i < lis.length; text.push( lis.eq( i++ ).text() ) );

			text = text.join( "," ) || settings.nothing;

			title
			.html( text )
			.attr( "title", text );

			if ( settings.autoWidth ) {
				content
				.css( {
					"min-width": target.width(),
					"display": "block"
				} );
			} else {
				content.css( "display", "" );
			}
		} )

		/** Show the content */
		.delegate( ".title", settings.type, function( e ) {

			if ( target.is( "[disabled]" ) ) { return; }
			
			if ( !target.hasClass( "open" ) ) {
				target
				.addClass( "open" )
				.focus();
			}

			e.stopPropagation();
			e.preventDefault();
		} )

		/** Select an item */
		.delegate( "li", "select.dropdown", function() {
			
			var self = $( this );

			if ( false === settings.multiple ) {
				content.find( "li.selected" ).removeClass( "selected" );;
			}

			self.addClass( "selected" );
		} )

		/** Deselect */
		.delegate( "li", "deselect.dropdown", function() {
			
			var self = $( this );

			if ( true === settings.required
				&& self.hasClass( "selected" )
				&& content.find( "li.selected" ).length === 1 ) {
			
				return;
			}

			self.removeClass( "selected" );
		} )

		/** Item toggle */
		.delegate( "li", "click toggle", function( e ) {
			
			var 
			item = $( this ),
		        selected,
		        click;

                        if ( item.is( "[disabled]" ) ) { return; }

			selected = item.hasClass( "selected" ),
			click = settings.clicks[ this.getAttribute( "data-index" ) ];

			if ( selected ) {
				item.trigger( "deselect.dropdown" );
			} else {
				item.trigger( "select.dropdown" );
			}

			target.trigger( "update.dropdown" );

			settings.click instanceof Function && settings.click.call( $( this ), e );
			"function" === typeof click && click();
		} )

		/** Deprecate */
		.delegate( "[event-name]", "click", function( e ) {
			
			var handler = settings.events[ this.getAttribute( "event-name" ) ];

			"function" === typeof handler && handler.call( self, this, e );
		} );

		render( content, settings );
	};

	Dropdown.prototype = {
		
		val: function( value ) {
			
			var res = [];

			if ( value ) {
				
				value = value instanceof Array ? value : [value];

				for ( var i = value.length; --i >= 0; ) {
					
					var
					item = this.$node.find( "ul li[item-value='" + value[ i ][ this.settings.valueKey ] + "']" );

					if ( item.length ) {
						item.trigger( "select.dropdown" );
						res.push( value[ i ][ this.settings.valueKey ] );
					}
				}
				this.$node.trigger( "update.dropdown" );
			} else {
				this.$node
					.find( "li.selected" )
					.each( function() {
						res.push( this.getAttribute( "item-value" ) );
					} );
			}

			return res;
		},

		add: function( data ) {
			
			var
			settings = this.settings,
			data = settings.data.concat( data );

			this.settings.data = data;

			render( this.$node.find( settings.selector4content ), this.settings );

			return this;
		},

		selectAll: function() {

                        var 
                        $node = this.$node,
                        settings = this.settings,
                        selected = $node.find( "ul li" );

                        if ( settings.multiple ) {
                                selected.addClass( "selected" );
                        } else if ( !selected.filter( ".selected" ).length ) {
                                selected.first().addClass( "selected" );
                        }

                        $node.trigger( "update.dropdown" );

			return this;
		},
	
		deselectAll: function() {

			this.$node.find( "ul li" ).removeClass( "selected" );
			this.$node.trigger( "update.dropdown" );

			return this;
		},

		disabled: function() {
			
			this.$node.attr( "disabled", true );
			return this;
		},

		enabled: function() {
			
			this.$node.removeAttr( "disabled" );
			return this;
		}
	};

	function render( content, settings ) {
		
		var 
		lis = function() {
			
			var res = "";

			settings.clicks = {};

			for ( var data = settings.data, i = 0, length = settings.data.length; 
					
					i < length; ++i ) {
				
				var li = settings.formatter( data[ i ], settings );

				res += $( "<p>" ).append( $( li ).attr( "data-index", i ) ).html();

				settings.clicks[ i ] = data[ i ][ "click" ];
			}

			return res;
		}();

		content
		.css( "display", "none" )
		.html( "<ul>" + lis + "</ul>" )
		.trigger( "update.dropdown" );
	}

	$.fn.dropdown = function( options ) {
		
		var instance = this.data( namespace );

		if ( !instance ) {
			
			instance = new Dropdown( this, $.extend( {}, $.fn.dropdown.defaults, options ) );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.dropdown.defaults = {
		
		nothing 	: "Please select",

		selector4title 	: ".title:first > p",
		selector4content: ".content:first",

		data            : [],

		type 	        : "click",

		autoWidth 	: false,

		multiple 	: false,

		required 	: false,

		textKey 	: "text",
		valueKey 	: "value",

		formatter: function( item, settings ) {
			return "<li item-value=" + item[ settings.valueKey ] + " title='" + item[settings.textKey] + "'><span>" + (item[ settings.textKey ] || item[ settings.valueKey ]) + "</span></li>";
		}
	};
} )( window.jQuery );
