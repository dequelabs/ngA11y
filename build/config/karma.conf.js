module.exports = function(config){
  config.set({
    basePath : '../../',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/nga11yfocus.js',
      'src/nga11yannounce.js',
      'test/*.js'
    ],

    exclude : [
      'bower_components/angular/*.min.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    reporters: ['spec'],

    plugins : [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-script-launcher',
            'karma-spec-reporter',
            'karma-jasmine'
            ]
  });
};
