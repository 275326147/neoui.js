
define( "util/Storage", function( Storage ) {
        
        return function() {

                var 
                deferred = [],
                userKey = "cache.userid/" + wpf_logonuid,
                entityKey = "cache.entityId/" + wpf_current_roleid,
                user = Storage.get( userKey ),
                entity = Storage.get( entityKey );

                if ( !user ) {
                        
                        $.ajax( {
                                data: {
                                        name: "wpf.user.GetUserInfoByW3Account"
                                }
                        } )
                        .done( function( data ) {
                        
                        } );
                }
        };
} );
