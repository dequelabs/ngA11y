
var fullModal = [
	'<div id="container" nga11y-modal>',
	'  <button id="closer" nga11y-modal-closer>Close</button>',
	'  <a id="link" href="http://random.com/">Random link</a>',
	'  <button id="button">Random button</button>',
	'</div>'
].join('\n');

/**
 * Fires a native DOM keydown event in PhantomJS.  This will
 * trigger event handlers on the target and containers.
 *
 * @param {HTMLElement} target 	The target of the keydown event
 * @param {Number} 		which	The ASCII code for the key
 * @param {Boolean} 	shift	Whether the shift key is pressed
 */
function phantomFireKey(target, which, shift) {

	var e = document.createEvent('Event');
	e.keyCode = which;
	e.view = window;
	e.which = which;
	e.shiftKey = shift || false;
	e.initEvent('keydown', true, true);

	target.dispatchEvent(e);
}

/**
 * Fires a native DOM keydown event in Chrome.  This will
 * trigger event handlers on the target and containers.
 *
 * It will NOT perform the default action - e.g.
 * tab-ing will not move focus.
 *
 * @param {HTMLElement} target 	The target of the keydown event
 * @param {Number} 		which	The ASCII code for the key
 * @param {Boolean} 	shift	Whether the shift key is pressed
 */
function chromeFireKey(target, which, shift) {

	var e = document.createEvent('KeyboardEvent');

	Object.defineProperty(e, 'keyCode', {
		get: function() {
			return this.keyCodeVal;
		}
	});

	Object.defineProperty(e, 'which', {
		get : function() {
			return this.keyCodeVal;
		}
	});

	e.initKeyboardEvent('keydown',
		true,
		true,
		document.defaultView,
		false,
		false,
		false,
		false,
		which,
		which
	);

	// can't work out the right constuctor
	// parameters for the shift-key, so kludge the
	// correct value here.
	delete e.shiftKey;
	Object.defineProperty(e, 'shiftKey', {value: shift || false });

	e.keyCodeVal = which;

	target.dispatchEvent(e);
}

/**
 * Fires a native DOM keydown event.
 *
 * Currently works in PhantomJS & Chrome
 *
 * @param {HTMLElement} target The target of the keydown event
 * @param {Number} 		which
 * @param {Boolean} 	shift
 */
function fireKey(target, which, shift) {

	try {
		// phantomjs doesn't support this constructor
		new KeyboardEvent('keydown');
	} catch (e) {
		// phantomjs
		return phantomFireKey(target, which, shift);
	}

	// Chrome
	return chromeFireKey(target, which, shift);
}

describe('ngA11y modal', function() {
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

	it('sets tabindex of container to -1', function() {
		// Compile a piece of HTML containing the directive
		var element = $compile(fullModal)($rootScope);
		document.body.appendChild(element[0]);
		$rootScope.$digest();
		expect(element.eq(0).attr('tabindex')).toEqual('-1');
		document.body.removeChild(element[0]);
	});

	it('closes the modal on pressing escape', function(done) {
		// Compile a piece of HTML containing the directive
		var element = $compile(fullModal)($rootScope);
		document.body.appendChild(element[0]);
		$rootScope.$digest();

		// spy on the closer's click event
		var clicked = false;
		window.angular.element('#closer').on('click', function() {
			clicked = true;
		});

		// fire an esc keypress
		fireKey(element[0], 27);

		// the click isn't fired on the same cycle of the
		// js engine - so we have to put a timeout here - ugh
		setTimeout(function() {
			expect(clicked).toBe(true);
			document.body.removeChild(element[0]);
			done();
		}, 1000);
	});

	describe('with focus on the first contained element', function() {

		var element;
		var initiallyFocused;

		beforeEach(function() {
			// Compile a piece of HTML containing the directive
			element = $compile(fullModal)($rootScope);
			document.body.appendChild(element[0]);
			$rootScope.$digest();
			initiallyFocused = document.getElementById('closer');
			initiallyFocused.focus();
		});

		afterEach(function() {
			document.body.removeChild(element[0]);
		});

		it('should focus the last element on shift-tab', function(done) {

			fireKey(initiallyFocused, 9, true);

			setTimeout(function() {
				expect(document.activeElement).toEqual(document.getElementById('button'));
				done();
			}, 500);
		});

	});

	describe('with focus on the last contained element', function() {

		var element;
		var initiallyFocused;

		beforeEach(function() {
			// Compile a piece of HTML containing the directive
			element = $compile(fullModal)($rootScope);
			document.body.appendChild(element[0]);
			$rootScope.$digest();
			initiallyFocused = document.getElementById('button');
			initiallyFocused.focus();
		});

		afterEach(function() {
			document.body.removeChild(element[0]);
		});

		it('should focus the first element on tab', function(done) {

			fireKey(initiallyFocused, 9);

			setTimeout(function() {
				expect(document.activeElement).toEqual(document.getElementById('closer'));
				done();
			}, 500);
		});

	});

});
