/*!
 * Angular Directives For Accessible Forms
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

	/**
	* Reset (remove-all) aria-desribedby ids added by these directives
	* and optionally add a new ID
	*
	* @param {Object}      ctrl    The angular control object
	* @param {HTMLElement} elem    The HTML element
	* @param {String}		[newId] (optional) A new ID to add
	*/
	function resetDescribedby(ctrl, elem, newId) {
		// older browsers return null if attribute doesn't exist
		var describedby = elem.getAttribute('aria-describedby') || '';
		var original = describedby;

		// remove all pre-existing desribedby ids - we don't just
		// set it to a null string in case other code is
		// using aria-describedby, so we remove them using the stored
		// array of ids on the ctrl object
		var previous = ctrl.describedby || [];
		for(var i = 0, len = previous.length; i < len; i++) {
			// replace all incidences of the id
			var replacer = new RegExp('(?:^|\\s)' + previous[i] + '(?!\\S)', 'g');
			describedby = describedby.replace(replacer, '');
		}
		ctrl.describedby = [];

		// add the optional new one
		if (newId) {
			// we only add the id if its not already there
			var match = new RegExp('(?:^|\\s)' + newId + '(?!\\S)');
			if (!match.test(describedby)) {
				// add the id to the list associated with the control
				ctrl.describedby.push(newId);
				// add the id to the aria-describedby attribute
				describedby += ' ' + newId;
			}
		}

		// only change the attribute if changes have been
		// made to the string
		if (describedby !== original) {
			elem.setAttribute('aria-describedby', describedby);
		}
	}

	/**
	* Directive to make aria-live announcements of validation errors
	*/
	module.directive('nga11yValidation', ['$timeout', 'nga11yAnnounce', function ($timeout, nga11yAnnounce) {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				// get value of the (optional) nga11y-announce-delay attribute
				var debounceAttr = attrs.nga11yValidationDelay;

				var currentTimeout;
				//default to a 2s debounce
				scope.debounce = debounceAttr ? parseInt(debounceAttr, 10) : 2000;

				// check whether a validation message should be read out
				function check(message) {
					$timeout(function() {
						var input = element[0];

						if (!input) {
							return;
						}

						input.setAttribute('aria-invalid', ctrl.$invalid);

						if (ctrl.$invalid) {

							var announcement = message ? message : '';

							// get value of announce-invalid attribute
							var validationId = attrs.nga11yValidationId;
							if (validationId) {

								// get the element with this id
								var validation = document.getElementById(validationId);
								if (!validation) {
									return;
								}

								// check whether the validation element is shown or hidden
								if (angular.element(validation).hasClass('ng-hide')) {
									// if hidden mark as valid
									resetDescribedby(ctrl, input);
								} else {
									// if shown, then build on the announcement
									announcement += ' ' + validation.innerText;
									// and add describedby and mark invalid
									resetDescribedby(ctrl, input, validationId);
								}
							}

							if (announcement !== '') {
								nga11yAnnounce.assertiveAnnounce(announcement);
							}
						}

					}, 0);

				}

				/**
				* Validate on blur
				*/
				element.bind('blur', function() {
					// cancel any outstanding validations
					// triggered by keystrokes
					if (currentTimeout) {
						$timeout.cancel(currentTimeout);
					}
					check('Previous field invalid.');
				});

				/**
				* Attach a validator to trigger an announcement
				* on pausing of entering data
				*/
				ctrl.$parsers.unshift(function (viewValue) {
					// cancel pre-exisiting timeouts
					if (currentTimeout) {
						$timeout.cancel(currentTimeout);
					}
					currentTimeout = $timeout(check, scope.debounce);
					return viewValue;
				});

			}
		};
	}]);

	/**
	* Directive function for adding a focus method to
	* a control, which will focus the associated element
	*/
	function controlFocusDirective() {
		return {
			restrict: 'E',
			require: '?ngModel',
			link: function (scope, elem, attr, ctrl) {
				if (ctrl) {
					ctrl.focus = function() {
						elem[0].focus();
					};
				}
			}
		};
	}

	// apply the controlFocusDirective to various
	// native elements
	module.directive('input', controlFocusDirective);
	module.directive('textarea', controlFocusDirective);
	module.directive('select', controlFocusDirective);

	/**
	* Directive for accessible forms
	*/
	module.directive('nga11yForm', ['$log', function ($log) {
		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elem, attr, ctrl) {

				// it must have a name attribute
				if (!attr.name) {
					$log.error('nga11yForm must have a name attribute');
					return;
				}

				// add a function that can focus the first element
				// to the scope, it might be useful elsewhere
				scope.focusFirst = function() {
					// the first input is found by checking for the invalid state
					var input = elem[0].querySelector('.ng-invalid');
					if (input && input.focus) {
						input.focus();
						return true;
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
	}]);
})();
