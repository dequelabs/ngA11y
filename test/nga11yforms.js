describe('ngA11y forms', function() {
	var $compile,
		$rootScope,
		$timeout,
		$log;

	// Load the ngA11y module, which contains the directive
	beforeEach(module('ngA11y'));

	// Store references to $rootScope, $timeout and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$log_){
		document.body.innerHTML = '';
		// inject dependencies
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
		$log = _$log_;
	}));

	// todo: add tests

	it('should throw an error if form is missing the name attribute', function() {
		var formFixture = [
			'  <form nga11y-form onsubmit="return false">',
			'    <label><input type="text" id="name1">Name</label>',
			'    <input id="button" type="submit">',
			'  </form>',
		].join('\n');

		var element = $compile(formFixture)($rootScope);
		document.body.appendChild(element[0]);
		element.submit();
		$rootScope.$digest();
		expect($log.error.logs[[0]]).toContain('nga11yForm must have a name attribute');
	});

});
