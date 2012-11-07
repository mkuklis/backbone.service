module.exports = function (grunt) {

  grunt.initConfig({
    min: {
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
        validthis: true
      },
      globals: {
        "Backbone": true
      }
    },

    lint: {
      files: ['/*.js']
    }
  });

  grunt.registerTask('default', 'lint min');
}
