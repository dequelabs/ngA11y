describe('ngA11y focus', function() {
	var $compile,
			$rootScope,
			$timeout;

	// Load the myApp module, which contains the directive
	beforeEach(module('ngA11y'));

	// Store references to $rootScope and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
	}));

	it('Calls the focus function', function(done) {
		// Compile a piece of HTML containing the directive
		var element = $compile('<input type="text" ng-attr-a11yfocus/>')($rootScope);
		var focusCalled;
		document.body.appendChild(element[0]);
		element[0].addEventListener('focus', function (e) {
			focusCalled = true;
		}, false);
		// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
		$rootScope.$digest();
		$timeout.flush();
		setTimeout(function () {
			// Check that the compiled element contains the templated content
			expect(focusCalled).toBe(true);
			document.body.removeChild(element[0]);
			done();
		}, 100);
	});
	it('Does not call the focus function when the element is hidden', function(done) {
		// Compile a piece of HTML containing the directive
		var element = $compile('<input type="text" ng-attr-a11yfocus style="display:none;"/>')($rootScope);
		var focusCalled;
		document.body.appendChild(element[0]);
		element[0].addEventListener('focus', function (e) {
			focusCalled = true;
		}, false);
		// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
		$rootScope.$digest();
		$timeout.flush();
		setTimeout(function () {
			// Check that the compiled element contains the templated content
			expect(focusCalled).toBe(undefined);
			document.body.removeChild(element[0]);
			done();
		}, 100);
	});
	it('Does not call the focus function when some element in the document already has focus', function(done) {
		// Compile a piece of HTML containing the directive
		var element = $compile('<input id="focussed" type="text"/><input type="text" ng-attr-a11yfocus/>')($rootScope);
		var focusCalled;
		angular.element(document.body).append(element);
		element[0].focus();
		element[1].addEventListener('focus', function (e) {
			focusCalled = true;
		}, false);
		// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
		$rootScope.$digest();
		$timeout.flush();
		setTimeout(function () {
			// Check that the compiled element contains the templated content
			expect(focusCalled).toBe(undefined);
			angular.element(document.body).empty();
			done();
		}, 100);
	});
	it('Does call the focus function when some HIDDEN element in the document already has focus', function(done) {
		// Compile a piece of HTML containing the directive
		var element = $compile('<input id="focussed" type="text"/><input type="text" ng-attr-a11yfocus/>')($rootScope);
		var focusCalled;
		angular.element(document.body).append(element);
		element[0].focus();
		element.eq(0).attr('style', 'display:none;');
		element[1].addEventListener('focus', function (e) {
			focusCalled = true;
		}, false);
		// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
		$rootScope.$digest();
		$timeout.flush();
		setTimeout(function () {
			// Check that the compiled element contains the templated content
			expect(focusCalled).toBe(true);
			angular.element(document.body).empty();
			done();
		}, 100);
	});
});