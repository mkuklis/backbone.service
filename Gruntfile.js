module.exports = function (grunt) {

  grunt.initConfig({
    uglify: {
      dist: {
        src: 'backbone.service.js',
        dest: 'backbone.service.min.js'
      }
    },

    jshint: {
      options: {
        asi: true,
        browser: true,
        curly: false,
        eqeqeq: false,
        expr: true,
        forin: false,
        newcap: true,
        laxcomma: true,
        strict: false,
        validthis: true,
        globals: {
          "Backbone": true
        }
      }
    },

    lint: {
      files: ['/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['jshint', 'uglify']);
}
