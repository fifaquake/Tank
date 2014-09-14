module.exports = function(grunt) {
	grunt.initConfig({
			pkg : grunt.file.readJSON('package.json'),
			concat: {
					options: {
					},
					dist: {
					    src:['public/javascripts/lib/jquery/dist/jquery.min.js',
							 'public/javascripts/lib/pixi/bin/pixi.js'],
						dest:'public/javascripts/libs.js'
					}
			},
			jshint: {
				files:['public/javascripts/sources/*.js'],
		        options: {
				}

			}
	});	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['concat', 'jshint']);
}
