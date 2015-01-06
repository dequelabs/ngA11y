/*!
 * Angular directive for controlling focus on route DOM updates
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

	module.directive('nga11yFocus', ['$timeout', function ($timeout) {
				function hidden(elem) {
					return !elem.offsetWidth || !elem.offsetHeight;
				}
				return {
					restrict: 'A',
					link: function (scope, element) {
						$timeout(function () {
							if (!document.activeElement ||
								(document.activeElement &&
									(hidden(document.activeElement) ||
									document.activeElement.nodeName === 'BODY'))) {
								// we lost our focus, correct that
								if (hidden(element[0])) {
									return;
								}
								if (!element[0].hasAttribute('tabindex')) {
									element[0].setAttribute('tabindex', '0');
								}
								element[0].focus();
							}
						}, 10);
					}
				};
			}]);
}());
