/**
 * Angular Directives For Accessible Modal Dialogs
 *
 * Copyright (C) 2014 Deque Systems Inc., All Rights Reserved
 *
 * See the project LICENSE file for usage
 */
(function() {
	'use strict';

	var module;
	try {
		module = angular.module('ngA11y');
	} catch (err) {
		module = angular.module('ngA11y', []);
	}

	var focusSelector = 'a, input, [tabindex], select, button, textarea, area';

	/**
	* Gets first and last focusable elements in a container
	*
	* @param {Object} container Angular element of the container
	* @returns {Object}			An object with first and last properties
	*/
	function getFocusable(container) {
		var native = container[0].querySelectorAll(focusSelector);
		var focusable = [];
		for (var i = 0, len = native.length; i < len; i++) {
			var focusableElement = native[i];
			// should block aria-hidden elements
			var ariaHidden = focusableElement.getAttribute('aria-hidden');
			if (ariaHidden && ariaHidden.toLowerCase() === 'true') {
				continue;
			}
			// should block tabindex of -1
			var tabIndex = focusableElement.getAttribute('tabindex');
			if (tabIndex && tabIndex === '-1') {
				continue;
			}

			focusable.push(native[i]);
		}


		if (focusable.length > 0) {
			return {
				first: focusable[0],
				last: focusable[focusable.length-1]
			};
		}
	}

	/**
	* Directive capture focus within a modal
	*
	* The directive assumes we will add an attribute 'a11y-modal' to
	* a suitable container element of the modal, and an 'a11y-modal-closer'
	* to any suitable control that when clicked will close the modal.
	*/
	module.directive('nga11yModal', ['$log', function ($log) {
		return {
			link: function (scope, element, attrs, ctrl) {
				// make the container focusable
				element.attr('tabindex', '-1');

				// find the closer
				var closer = element[0].querySelector('[nga11y-modal-closer]');

				// bind a keydown to the container and we
				// will attempt to use this to capture focus
				element.on('keydown', function(e) {

					// get focusable on each keypress in case of
					// dynamic content
					var focusable = getFocusable(element);

					if (focusable) {
						// handle tab and shift tab on first/last
						if (e.target.isSameNode(focusable.first)) {
							if (e.which === 9 && e.shiftKey) {
								focusable.last.focus();
								e.preventDefault();
								return;
							}
						} else if (e.target.isSameNode(focusable.last)) {
							if (e.which === 9 && !e.shiftKey) {
								focusable.first.focus();
								e.preventDefault();
								return;
							}
						}
						// handle escape
						if (e.which === 27) {
							if (closer) {
								angular.element(closer).triggerHandler('click');
							}
						}
					}
				});
			}
		};
	}]);
})();
