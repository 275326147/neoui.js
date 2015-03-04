
(function( $ ) {

        var

	Slide = function( target, settings ) {
	
		var 
                trigger = "string" === typeof settings.selector4trigger ? target.find( settings.selector4trigger ) : settings.selector4trigger,
		content = "string" === typeof settings.selector4content ? target.find( settings.selector4content ) : settings.selector4content,
		
		onClose = settings.onClose,
		onOpen = settings.onOpen,
	
		self = this;

		this.$node = target;
		this.settings = settings;

		"function" === typeof settings.init && settings.init.call( this, target );

		trigger.on( "click", function( e ) {
		
			if ( target.hasClass( settings.class4open ) ) {
				target.add( content ).removeClass( settings.class4open );
				"function" === typeof onClose && onClose.call( self );
			} else {
				target.add( content ).addClass( settings.class4open );
				onOpen instanceof Function && onOpen.call( self );
			}
		} );
	},

        namespace = "$ui.slide";

	Slide.prototype = {
		
		open: function() {
		
			if ( !this.$node.hasClass( this.settings.class4open ) ) {
				this.$node.find( this.settings.selector4trigger ).click();
			}
		},

		close: function() {
		
			if ( this.$node.hasClass( this.settings.class4open ) ) {
				this.$node.find( this.settings.selector4trigger ).click();
			}
		},

                toggle: function() {

                        this
                        .$node
                        .find( this.settings.selector4trigger )
                        .click();
                }
	};

	$.fn.slide = function( options ) {
		
		var 
                instance = this.data( namespace ),
		settings = $.extend( {}, $.fn.slide.defaults, options || {} );

		if ( !instance ) {
			instance = new Slide( this, settings );
			this.data( namespace, instance );
		}

		return instance;
	};

        $.fn.slide.defaults = {

		class4open 	: "open",
		selector4trigger: ".title:first",
		selector4content: ".content:first"
        };

})( window.jQuery );
