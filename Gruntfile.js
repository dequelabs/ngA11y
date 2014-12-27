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
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask("test", [ "karma:unit" ] );
    grunt.registerTask("default", "test");
};
