var grunt = function(grunt) {

  // Run `grunt server` for live-reloading development environment
  grunt.registerTask('server', [ 'express', 'watch' ]);

  // Run `grunt server:unit` for live-reloading unit testing environment
  grunt.registerTask('server:unit', [ 'express', 'watch:test' ]);

  // Run `grunt test` (used by `npm test`) for continuous integration (e.g. Travis)
  grunt.registerTask('test', [ 'simplemocha:all' ]);

  // Run `grunt test:unit` for single-run unit testing
  grunt.registerTask('test:unit', [ 'simplemocha:unit' ]);

  // I would like to have a task that formats and commits
  // grunt.registerTask('commit', [ 'jsbeautifier:format', 'jshint', 'gitcommit' ]);

  // I would also like to have a task that tests and pushes to staging and productions -- failing to push when a test fails
  // grunt.registerTask('push:production', [ 'test', 'gitpush:production' ]);
  // grunt.registerTask('push:staging', [ 'test', 'gitpush:staging' ]);
  // grunt.registerTask('push', [ 'test', 'gitpush:origin' ]);

  // Configuration
  grunt.config.init({

    // Directory CONSTANTS (see what I did there?)
    SERVER_DIR:     'server/',
    TEST_DIR:       'test/',

    // Glob CONSTANTS
    ALL_FILES:      '**/*',
    JS_FILES:       '**/*.js',

    // Express requires `server.script` to reload from changes
    express: {
      server: {
        options: {
          script:   '<%= SERVER_DIR %>/server.js'
        }
      }
    },

    // Validate app `client` and `server` JS
    jshint: {
      files: [ '<$= SERVER_DIR + JS_FILES %>' ], 
      options: {
        jshintrc: '.jshintrc' // using .jshintrc for shared settings
      }
    },

    jsmeter: {
      files: {
        src: ['<%= jshint.files %>'],
      }
    },

    // Beautify javascript files to keep consistency in the repo
    jsbeautifier: {
      format: {
        src: ["<%= jshint.files %>"],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      check: {
        src: ["<%= jshint.files %>"],
        options: {
          mode: "VERIFY_ONLY",
          config: '.jsbeautifyrc'
        }
      }
    },

    simplemocha: {
      options: {
        globals: ['should', 'suite'],
        timeout: 15000,
        ignoreLeaks: false,
        // grep: '*-test',
        ui: 'tdd',
        reporter: 'tap'
      },

      all: {
        src: grunt.option('src') || 'test/*.js',
      },
    },

    // "watch" distinct types of files and re-prepare accordingly
    watch: {
      options: {
        debounceDelay:  200,
        livereload:     true,
        nospawn:        true,
      }, 

      // Changes to server-side code should validate, restart the server, & refresh the browser
      server: {
        files:      '<%= SERVER_DIR + ALL_FILES %>',
        tasks:      [ 'jshint', 'express' ]
      }, 

      test: {
        files:      '<%= TEST_DIR + ALL_FILES %>', 
        tasks:      [ 'simplemocha' ]
      }
    }
});

  // Dependencies
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-jsmeter');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-checkrepo');
  grunt.loadNpmTasks('grunt-simple-mocha');
}

module.exports = grunt;