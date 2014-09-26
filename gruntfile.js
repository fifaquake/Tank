module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat: {
			options: {
			},
			dist: {
				src:['public/javascripts/lib/jquery/dist/jquery.min.js',
					 'public/javascripts/lib/pixi/bin/pixi.js',
					 'public/javascripts/lib/socket.io-client/socket.io.js'],
				dest:'public/javascripts/libs.js'
			}
		},

		jshint: {
			files:['public/javascripts/sources/*.js',
				   'server/**/*.js',
				   'bin/*',
				   '!public/javascripts/sources/*.min.js'],
			options: {
			}
		},
		
		uglify: {
			my_target: {
				files: {
					'public/javascripts/sources/client.min.js': ['public/javascripts/sources/client.js']
				}
			}
		}
	});	

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('all', ['concat', 'jshint', 'uglify']);
	grunt.registerTask('default', ['jshint', 'uglify']);
}
