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

	afterEach(function(){
		// Messages logged using $log.error()
		console.log($log.error.logs);

		// Messages logged using $log.debug()
		console.log($log.debug.logs);
	});

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

	it('should support multiple forms by sending focus to the relevant empty input on submit', function() {
		var formFixture = [
			'<div>',
			'  <form name="form1" nga11y-form onsubmit="return false">',
			'    <label><input type="text" id="name1">Name</label>',
			'    <input id="button" type="submit">',
			'  </form>',
			'  <form name="form2" nga11y-form onsubmit="return false">',
			'    <label><input type="text" id="name2">Name</label>',
			'    <input id="button2" type="submit">',
			'  </form>',
			'</div>'
		].join('\n');

		// Compile a piece of HTML containing the directive
		var element = $compile(formFixture)($rootScope);
		document.body.appendChild(element[0]);
		var form2 = element.find('form').eq(1);
		var input2 = form2.find('input[type="text"]');
		spyOn(input2[0],'focus');
		input2.triggerHandler({type:"keydown", which: 13});
		$rootScope.$digest();
		expect(input2[0].focus).toHaveBeenCalled();
		document.body.removeChild(element[0]);
	});
});
