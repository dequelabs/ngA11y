describe('ngA11y focus', function() {
	var $compile,
			$rootScope,
			$timeout;

	// Load the ngA11y module, which contains the directive
	beforeEach(module('ngA11y'));

	// Store references to $rootScope, $timeout and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_){
		document.body.innerHTML = '';
		// inject dependencies
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
	}));

	it('Calls the focus function', function() {
		// Compile a piece of HTML containing the directive
		var element = $compile('<input type="text" ng-attr-nga11y-focus/>')($rootScope);
		document.body.appendChild(element[0]);
		spyOn(element[0],'focus');
		$rootScope.$digest();
		$timeout.flush();
		expect(element[0].focus).toHaveBeenCalled();
		document.body.removeChild(element[0]);
	});
	it('Does not call the focus function when the element is hidden', function() {
		// Compile a piece of HTML containing the directive
		var element = $compile('<input type="text" ng-attr-nga11y-focus style="display:none;"/>')($rootScope);
		document.body.appendChild(element[0]);
		spyOn(element[0],'focus');
		$rootScope.$digest();
		$timeout.flush();
		expect(element[0].focus).not.toHaveBeenCalled();
		document.body.removeChild(element[0]);
	});
	it('Does not call the focus function when some element in the document already has focus', function() {
		// Compile a piece of HTML containing the directive
		var element = $compile('<input id="focussed" type="text"/><input type="text" ng-attr-nga11y-focus/>')($rootScope);
		angular.element(document.body).append(element);
		element[0].focus();
		spyOn(element[1],'focus');
		$rootScope.$digest();
		$timeout.flush();
		expect(element[1].focus).not.toHaveBeenCalled();
		angular.element(document.body).empty();
	});
	it('Does call the focus function when some HIDDEN element in the document already has focus', function() {
		// Compile a piece of HTML containing the directive
		var element = $compile('<input id="focussed" type="text"/><input type="text" ng-attr-nga11y-focus/>')($rootScope);
		angular.element(document.body).append(element);
		element[0].focus();
		element.eq(0).attr('style', 'display:none;');
		spyOn(element[1],'focus');
		$rootScope.$digest();
		$timeout.flush();
		expect(element[1].focus).toHaveBeenCalled();
		angular.element(document.body).empty();
	});
});
