module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'app/**/*.js',
        'admin/**/*.js',
        'test/**/*.js',
        'shared/**/*.js',
        'server/**/*.js'
      ],
      options: {
        globals: {
          window: true,
          document: true,
          navigator: true,
          console: true,
          module: true,
          require: true,
          FastClick: true,
          $: true,
          Backbone: true,
          Parse: true,
          Handlebars: true,
          _: true,
          google: true,
          parseAppId: true,
          parseJSKey: true,
          ga: true,
          test: true,
          ok: true,
          equal: true,
          deepEqual: true
        },
        undef: true,
        debug: true,
        '-W030': true
      }
    },

    // A simple Grunt invoker for mocha tests
    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'dot'
      },

      all: {
        src: 'test/unit/**/*.js'
      }
    },

    // run the 'default' task when any watched files change
    watch: {
      files: [
        'Gruntfile.js',
        'app/**/*',
        'admin/**/*',
        'shared/**/*',
        'server/**/*',
        'vendor/**/*',
        '!vendor/**/*.min.*',
        'test/**/*'
      ],
      tasks: ['default']
    },

    sass: {
      // generate app-specific css file
      // sass performs both the processing and concatenation steps for css
      options: {
        loadPath: '.',
        bundleExec: true
      },
      app: {
        src: 'app/css/app.scss',
        dest: 'tmp/linksf.css'
      },

      admin: {
        src: 'admin/css/admin.scss',
        dest: 'tmp/linksf_admin.css'
      }
    },

    // Browserify
    browserify: {
      options: {
        // We want `.hbs` files to be `require`able. We use the hbsfy transform
        // to precompile Handlebars templates and let us require the compiled
        // JavaScript functions.
        transform: ['hbsfy']
      },
      app: {
        // The entry point where Browserify will begin searching the AST for `require` calls
        src: 'app/js/app.js',

        // The built file
        dest: 'tmp/app.js',

        options: {
          // We want alias mappings because we'd rather
          // `require('views/index_view')` than `require('./views/index_view.js')`
          //
          // There is a tradeoff for convenient here - all aliased files are exported
          // into the built app.js file, even if they're never explicitly
          // `require`d from the entry point tree.
          aliasMappings: [
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'shared/lib' },
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'cloud/lib' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'shared/models' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'cloud/models' },
            { cwd: 'shared/js/collections', src: '*.js',  dest: 'shared/collections' },
            { cwd: 'shared/js/views',       src: '*.js',  dest: 'shared/views' },
            { cwd: 'shared/js/templates',   src: '*.hbs', dest: 'shared/templates' },
            { cwd: 'app/js/lib',            src: '*.js',  dest: 'lib' },
            { cwd: 'app/js/models',         src: '*.js',  dest: 'models' },
            { cwd: 'app/js/collections',    src: '*.js',  dest: 'collections' },
            { cwd: 'app/js/routers',        src: '*.js',  dest: 'routers' },
            { cwd: 'app/js/templates',      src: '*.hbs', dest: 'templates' },
            { cwd: 'app/js/views',          src: '*.js',  dest: 'views' }
          ]
        }
      },
      // See browserify:app above
      admin: {
        src: 'admin/js/admin.js',
        dest: 'tmp/admin.js',
        options: {
          aliasMappings: [
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'shared/lib' },
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'cloud/lib' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'shared/models' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'cloud/models' },
            { cwd: 'shared/js/collections', src: '*.js',  dest: 'shared/collections' },
            { cwd: 'shared/js/views',       src: '*.js',  dest: 'shared/views' },
            { cwd: 'shared/js/templates',   src: '*.hbs', dest: 'shared/templates' },
            { cwd: 'admin/js/lib',          src: '*.js',  dest: 'lib' },
            { cwd: 'admin/js/models',       src: '*.js',  dest: 'models' },
            { cwd: 'admin/js/collections',  src: '*.js',  dest: 'collections' },
            { cwd: 'admin/js/routers',      src: '*.js',  dest: 'routers' },
            { cwd: 'admin/js/templates',    src: '*.hbs', dest: 'templates' },
            { cwd: 'admin/js/views',        src: '*.js',  dest: 'views' }
          ]
        }
      }
    },

    // Minify css files
    cssmin: {
      app: {
        src: 'tmp/linksf.css',
        dest: 'tmp/linksf.css'
      },
      admin: {
        src: 'tmp/linksf_admin.css',
        dest: 'tmp/linksf_admin.css'
      },
    },

    // Concatenate files together.
    concat: {
      // Not a target, just a variable that we can interpolate in elsewhere.
      shared_js: [
        'vendor/js/jquery-2.0.3.js',
        'vendor/js/jquery.serialize-object.js',
        'vendor/js/underscore.js',
        'vendor/js/backbone-1.0.0.js',
        'vendor/js/parse-1.2.12.js'
      ],

      shared_js_minified: [
        'vendor/js/jquery-2.0.3.min.js',
        'vendor/js/jquery.serialize-object.min.js',
        'vendor/js/underscore.min.js',
        'vendor/js/backbone-1.0.0.min.js',
        'vendor/js/parse-1.2.12.min.js'
      ],

      // App also uses the vendored fastclick library
      // App uses backbone filters for tracking
      app: {
        src: [
          '<%= concat.shared_js %>',
          'vendor/js/backbone_filters.js',
          'vendor/js/jquery.switch.js',
          'vendor/js/bootstrap-button.js',
          'vendor/js/fastclick.js',
          'tmp/app.js'
        ],
        dest: 'tmp/linksf.js'
      },

      // Concat minified files
      app_min: {
        src: [
          '<%= concat.shared_js_minified %>',
          'vendor/js/backbone_filters.js',
          'vendor/js/jquery.switch.min.js',
          'vendor/js/bootstrap-button.min.js',
          'vendor/js/fastclick.min.js',
          'tmp/app.min.js'
        ],
        dest: 'tmp/linksf.js'
      },

      // Admin uses backbone filters for authentication and autosize for text entry
      admin: {
        src: [
          '<%= concat.shared_js %>',
          'vendor/js/backbone_filters.js',
          'vendor/js/jquery.autosize.js',
          'vendor/js/bootstrap.js',
          'tmp/admin.js'
        ],
        dest: 'tmp/linksf_admin.js'
      },

      admin_min: {
        src: [
          '<%= concat.shared_js_minified %>',
          'vendor/js/backbone_filters.min.js',
          'vendor/js/jquery.autosize.min.js',
          'vendor/js/bootstrap.min.js',
          'tmp/admin.min.js'
        ],
        dest: 'tmp/linksf_admin.js'
      }
    },

    // Minify JavaScript files
    uglify: {
      options: {
        mangle: false,
        preserveComments: false,
        report: 'min'
      },

      vendor: {
        files: {
          // These libraries are not distributed with minified versions, so we
          // minify them ourselves.
          'vendor/js/jquery.serialize-object.min.js': 'vendor/js/jquery.serialize-object.js',
          'vendor/js/backbone_filters.min.js': 'vendor/js/backbone_filters.js',
          'vendor/js/bootstrap-button.min.js': 'vendor/js/bootstrap-button.js'
        }
      },
      app: {files: {'tmp/app.min.js': 'tmp/app.js'}},
      admin: {files: {'tmp/admin.min.js': 'tmp/admin.js'}}
    },

    // Remove built files and temporary artifacts between builds
    clean: {
      build: {
        src: 'build/*',
        filter: function(filepath) { return filepath !== 'build/.gitkeep'; }
      },

      tmp: {
        src: 'tmp/*',
        filter: function(filepath) { return filepath !== 'tmp/.gitkeep'; }
      },

      test: {
        src: 'test/acceptance/app.html'
      }
    },

    // Add cache-busting hashes to each built file. The hashes change with file content.
    cachebuster: {
      app: {
        files: {
          src: [
            'tmp/linksf.js',
            'tmp/linksf.css'
          ],
        },
        options: {
          complete: function(hashes) {
            var context = {},
                Handlebars = require('handlebars'),
                template,
                output,
                keyMap = {
                  'tmp/linksf.js': 'linksf_js',
                  'tmp/linksf.css': 'linksf_css'
                };

            Object.keys(hashes).forEach(function(key) {
              var matches = key.match(/^tmp\/(.*)(\..*)$/),
                  filename = matches[1],
                  extension = matches[2],
                  outputFile = 'build/' + filename + '-' + hashes[key] + extension;

              grunt.file.copy(key, outputFile);
              context[keyMap[key]] = outputFile;
            });

            template = Handlebars.compile(grunt.file.read('tmp/index.html'));
            output = template(context);
            grunt.file.write('index.html', output);

            template = Handlebars.compile(grunt.file.read('test/acceptance/app.template'));
            output = template(context);
            grunt.file.write('test/acceptance/app.html', output);
          }
        }
      },

      admin: {
        files: {
          src: [
            'tmp/linksf_admin.js',
            'tmp/linksf_admin.css'
          ]
        },
        options: {
          complete: function(hashes) {
            var context = {},
                Handlebars = require('handlebars'),
                template,
                output,
                keyMap = {
                  'tmp/linksf_admin.js': 'linksf_admin_js',
                  'tmp/linksf_admin.css': 'linksf_admin_css'
                };

            Object.keys(hashes).forEach(function(key) {
              var matches = key.match(/^tmp\/(.*)(\..*)$/),
                  filename = matches[1],
                  extension = matches[2],
                  outputFile = 'build/' + filename + '-' + hashes[key] + extension;

              grunt.file.copy(key, outputFile);
              context[keyMap[key]] = outputFile;
            });

            template = Handlebars.compile(grunt.file.read('tmp/admin.html'));
            output = template(context);
            grunt.file.write('admin.html', output);
          }
        }
      }
    },

    qunit: {
      all: ['test/acceptance/**/*.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-cachebuster');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadTasks('tasks');

  grunt.registerTask('build:prereqs', [
    'clean',
    'jshint',
    'simplemocha'
  ]);

  grunt.registerTask('build:development', [
    'build:prereqs',
    'build:development:app',
    'build:development:admin'
  ]);

  grunt.registerTask('build:development:app', [
    'sass:app',
    'browserify:app',
    'concat:app',
    'configure:development:app',
    'cachebuster:app',
    'qunit'
  ]);

  grunt.registerTask('build:development:admin', [
    'sass:admin',
    'browserify:admin',
    'concat:admin',
    'configure:development:admin',
    'cachebuster:admin'
  ]);

  grunt.registerTask('build:production', [
    'build:prereqs',
    'sass',
    'cssmin',
    'browserify',
    'uglify',
    'concat:app_min',
    'concat:admin_min',
    'configure:production',
    'cachebuster',
    'qunit'
  ]);

  grunt.registerTask('default', [
    'build:prereqs',
    'build:development:app',
    'build:development:admin'
  ]);
};
