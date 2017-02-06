describe('ngA11y forms', function() {
	var $compile,
		$rootScope,
		$timeout,
		$log,
		$scope;

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
		$scope = $rootScope;
	}));

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

	it('should send focus to the first invalid input in a form on submit', function(done) {
		$scope.someVariable = 1;
		var formFixture = [
			'<div>',
			'  <form name="form1" nga11y-form onsubmit="return false">',
			'    <label><input type="text" ng-model="someVariable" id="name1" ng-maxlength="1">Name</label>',
			'    <input id="button" type="submit">',
			'  </form>',
			'  <form name="form2" nga11y-form onsubmit="return false">',
			'    <label><input type="text" ng-model="someVariable" id="name2" ng-maxlength="1">Name</label>',
			'    <input id="button2" type="submit">',
			'  </form>',
			'</div>'
		].join('\n');

		// Compile a piece of HTML containing the directive
		var element = $compile(formFixture)($rootScope);
		document.body.appendChild(element[0]);
		var form1 = element.find('form').eq(0);
		var input1 = form1.find('input[type="text"]');
		$scope.$apply(function() {
			$scope.someVariable = 12;
		})
		form1.triggerHandler('submit');
		$rootScope.$digest();

		setTimeout(function() {
			expect(document.activeElement).toBe(input1[0]);
			document.body.removeChild(element[0]);
			done();
		}, 500);
	});
});
