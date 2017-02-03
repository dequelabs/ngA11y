module.exports = function(grunt) {
  // Do grunt-related things in here
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        karma: {
            unit: {
                configFile: 'build/config/karma.conf.js',
                singleRun: true
            },
            punit: {
                configFile: 'build/config/karma.conf.js',
                singleRun: false
            },
            phantom: {
                configFile: 'build/config/karma-phantom.conf.js',
                singleRun: true
            }
        },
        uglify: {
            options: {
                preserveComments: 'no',
                banner: ['/*!',
                    '* Angular Directives For Accessible Applications',
                    '*',
                    '* Copyright (C) 2015-2017 Deque Systems Inc., All Rights Reserved',
                    '*',
                    '* See the project LICENSE file for usage - https://github.com/dequelabs/ngA11y/blob/master/LICENSE',
                    '*/\n'].join('\n')
            },
            dist: {
                files: {
                    'dist/nga11ymodal.min.js': ['src/nga11ymodal.js'],
                    'dist/nga11yforms.min.js': ['src/nga11yforms.js'],
                    'dist/editableGrid.min.js': ['src/editableGrid.js'],
                    'dist/nga11yfocus.min.js': ['src/nga11yfocus.js'],
                    'dist/nga11yannounce.min.js': ['src/nga11yannounce.js'],
                    'dist/nga11y.min.js': ['src/nga11ymodal.js',
                        'src/editableGrid.js',
                        'src/nga11yforms.js',
                        'src/nga11yfocus.js',
                        'src/nga11yannounce.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('test', [ 'karma:unit' ] );
    grunt.registerTask('travis', [ 'karma:phantom' ]);
    grunt.registerTask('default', ['dist', 'test']);
    grunt.registerTask('dist', 'uglify:dist');
};
