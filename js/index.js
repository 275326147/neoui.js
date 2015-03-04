
require.config( {
	
	baseUrl: "js/src",

	paths: {
		views: "../views"
	}
} );

require( [ "ui/Menu", "ui/Ripple", "util/Router" ], function( Menu ) {

	var showLogin = false;

        $.ajaxSetup( {
                url: "/service",

                error: function( xhr ) {
                
                        /** Handle the redirect(Set nginx break the 302 code) */
                        if ( !showLogin && xhr.status === 404 && this.url.search( /^\/service/i ) === 0 ) {
                                
                                showLogin = !showLogin;

                                $.amodal( {
                                        showHead: false,
                                        showProgress: false,
                                        closeByESC: false,
                                        closeByDocument: false,

                                        render: function( ready, loading, close ) {
                                                
                                                this.load( "/views/login.html", function() {
                                                        
                                                        var 
                                                        self = $( this ),
                                                        message = self.find( "p.error" ),
                                                        login = self.find( "button[name=login]" ),
                                                        username = self.find( "input[name=uid]" ),
                                                        password = self.find( "input[name=password]" ),
                                                        ripple = login.ripple( { 
                                                                random: true, 
                                                                speed: 500,
                                                                type: false
                                                        } ),
                                                        doLogin = function( e ) {

                                                                if ( !username.val().length || !password.val().length ) {
                                                                        return message.html( "Username or Password is empty." ).show();
                                                                }

                                                                ripple.show();

                                                                $.ajax( {
                                                                        url: "/login",
                                                                        type: "POST",

                                                                        data: {
                                                                                actionFlag: "loginAuthenticate",
                                                                                uid: username.val(),
                                                                                password: password.val()
                                                                        }
                                                                } )
                                                                .done( function( data, xhr ) {

                                                                        message.hide();

                                                                        showLogin = !showLogin;

                                                                        if ( ~~$.cookie( "login_failLoginCount" ) > 0 ) {

                                                                                message.html( "Invalid username or password." ).show();
                                                                                username.focus().add( password ).val( "" );
                                                                                $.cookie( "login_failLoginCount", 0, { expires: -1 } );

                                                                                return;
                                                                        }

									setTimeout( function() {
										login.html( "&nbsp;" ).attr( "disabled", true ).addClass( "icon success" );
									}, 3000 );

                                                                        setTimeout( function() { 
                                                                        	close(); 
                                                                        }, 3500 );
                                                                } )
                                                                .always( function() {
                                                                	setTimeout( function() {
										ripple.hide();
                                                                	}, 3000 );
                                                                } );
                                                        };

                                                        self
                                                        .delegate( "button[name=login]", "click", function( e ) {
                                                                doLogin( e );
                                                        } )
                                                        .delegate( "input[name=password]", "keyup", function( e ) {
                                                                
                                                                e.keyCode === 13 && doLogin( e );
                                                        } );
                                                } );
                                        }
                                } );
                        }
                }
        } );

	$( function() {
		$( document.body ).removeClass( "out" );
	} );

	$( "#nav" )

	.delegate( ".hamburger", "click", Menu )
	
	.delegate( "i.icon.github2", "click", function() {
	
                window.open( "//www.github.com/trazyn/neoui.js" );
	} );

	$( "#canvas" )

	.delegate( "button[name=wiki]", "click", Menu )

        .delegate( "button[name=checkout], button[name=github], .icon.github3", "click", function( e ) {
                
                window.open( "//www.github.com/trazyn/neoui.js" );
        } );
} );
