/**
* Angular Directives For Accessible Forms
*
* Copyright (C) Deque Systems Inc
*/

'use strict';

(function() {

	var module;
	try {
		module = angular.module('ngA11y');
	} catch (err) {
		module = angular.module('ngA11y', []);
	}

	/**
	* Simple implementation of closest for implementation without jQuery
	*
	* TODO: consider moving this to somewhere we can have some shared utility
	* 		functions
	*
	* @param  {Object} elem The angular element object
	* @param  {String} name Name of the ancestor element
	* @return {Object}      The angular element of the closest element with this name
	*                       or undefined if no result
	*/
	function closest(elem, name) {

		name = name.toUpperCase();

		var cur = elem;
		var tagName;

		while(true) {
			tagName = cur.prop('tagName');
			if (tagName === 'BODY') {
				break;
			}
			if (tagName === name) {
				return cur;
			}
			cur = cur.parent();
		}
	}

	/**
	* Directive to detect visited state of all input fields
	*/
	module.directive('blurFocus', function ($log) {
		return {
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {

				if (!ctrl) {
					return;
				}

				/**
				* Focuses the element of this input
				*/
				ctrl.focus = function () {
					element.focus();
				};

				/**
				* Whether the control fails validation
				* @return {Boolean} True = fails validation
				*/
				ctrl.failsValidation = function () {
					return !!ctrl.hasVisited && !!ctrl.$invalid;
				};

				// on focus note that
				element.on('focus', function () {
					element.addClass('has-focus');

					scope.$apply(function () {
						ctrl.hasFocus = true;
					});
				});

				// on blur apply the had visited property
				element.on('blur', function () {
					$log.log('blur');
					element.removeClass('has-focus');
					element.addClass('has-visited');

					scope.$apply(function () {
						ctrl.hasFocus = false;
						ctrl.hasVisited = true;
					});
				});

				// if the form submits - assume we've visted all the fields
				var form = closest(element, 'form');
				if (form) {
					form.on('submit', function() {
						element.addClass('has-visited');

						scope.$apply(function () {
							ctrl.hasFocus = false;
							ctrl.hasVisited = true;
						});
					});
				}
			}
		};
	});

	/**
	* Directive for accessible forms
	*/
	module.directive('accessibleForm', function ($log) {
		return {
			restrict: 'A',
			link: function (scope, elem, attr, ctrl) {

				// it must have a name attribute
				if (!attr.name) {
					$log.error('accessibleForm must have a name attribute');
					return;
				}

				// the form is found on the scope by
				// its name property
				var form = scope[attr.name];

				// add a function that can focus the first element
				// to the scope, it might be useful elsewhere
				scope.focusFirst = function() {
					// makes use of the fact that the inputs
					// are in the order they appear on the page
					for (var key in form) {
						if (form.hasOwnProperty(key) && key.indexOf('$') !== 0) {
							var input = form[key];
							if (input.$invalid) {
								if (input.focus) {
									input.focus();
								}
								return true;
							}
						}
					}
					return false;
				};

				// handle any submit event
				elem.on('submit', function(e) {
					if (scope.focusFirst()) {
						e.preventDefault();
					}
				});
			}
		};
	});
})();
