module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'dist/nga11y.min.js',
      'node_modules/axe-core/axe.min.js',
      'test/*.js'
    ],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: { base: 'ChromeHeadless', flags: ['--no-sandbox'] }
    },
    reporters: ['spec'],
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-spec-reporter']
  });
};
