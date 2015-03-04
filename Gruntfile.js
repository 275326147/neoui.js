
module.exports = function( Grunt ) {
	
	Grunt.initConfig( {
		
		pkg: Grunt.file.readJSON( "./package.json" ),

		/** JSHint configurations */
		jshint: {
			ignore_warning: {
				options: {
					
					"laxcomma": true,
					"smarttabs": true,
					"loopfunc": true,
					"shadow": true,

					/** 1 && callback() */
					"expr": true,

					/** var a = b = c = "" */
					"-W120": true,

					/** See https://github.com/jshint/jshint/blob/master/src/messages.js */
					"-W099": true,
					"-W099": true,
					"-W061": true,
					"-W007": true,
					"-W064": true,
					"-W069": true,
					"-W014": true,
					"-W018": true
				},

				/**
				 * The paths tell jshint which file to validate
				 *
				 * \**\: traverse through all levels child of directory hierarchy
				 * \*.js\: evaluate all files with .js extension
				 * */
				src: [ "src/**/*.js" ]
			}
		},

		/** This is where we configure "uglify" */
		uglify: {

			options: {
				mangle: true,

				compress: {
					/** Discard console.* functions */
					drop_console: true,

					/** Remove unreachable code */
					dead_code: true,

					/** Drop unused variable/function */
					unused: true
				},

				/** Banner comments */
				banner: "/** Build on " + (new Date()).toDateString() + "*/\n"
			},

			vendor: {

				/** Combine file */
				files: {
					"js/lib/vendor.js": [ "js/lib/require.js", "js/lib/jquery-1.7.1.min.js",

					"js/src/util/Cookie.js",

                                        /** Core */
                                        "js/src/slick/core/Drag.js", "js/src/slick/core/Core.js", "js/src/slick/core/Grid.js", "js/src/slick/core/Dataview.js" ] 

                                        /**
                                        "js/src/slick/curd/Add.js", "js/src/slick/curd/Delete.js", "js/src/slick/curd/Update.js", "js/src/slick/curd/Validation.js",

                                        "js/src/slick/paging/Conditions.js", "js/src/slick/paging/Local.js", "js/src/slick/paging/Remote.js", "js/src/slick/paging/Paging.js",
                                        "js/src/slick/plugins/Actionbar.js", "js/src/slick/plugins/Checkboxcolumn.js", "js/src/slick/plugins/Genius.js", "js/src/slick/plugins/MyColumns.js", "js/src/slick/plugins/Radiocolumn.js", "js/src/slick/plugins/RowsModel.js",

                                        "js/src/slick/editors/Calendar.js", "js/src/slick/editors/Dialog.js", "js/src/slick/editors/Select.js", "js/src/slick/editors/Text.js", "js/src/slick/editors/Textarea.js"
                                        */
				}
			},

			all: {
				files: [ {
					expand: true,
					cwd: "src",
					src: "**/*.js",
					dest: "all"
				} ]
			}
		}
	} );

	Grunt.loadNpmTasks( "grunt-contrib-uglify" );
	Grunt.loadNpmTasks( "grunt-contrib-jshint" );


	/** Tasks */
	Grunt.registerTask( "default", [ "uglify:vendor" ] );
	Grunt.registerTask( "lint", [ "jshint" ] );
	Grunt.registerTask( "all", [ "uglify:all" ] );
};
