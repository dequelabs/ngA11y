/*!
 * Angular service for ARIA live regions announcements
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
	 *
	 * The a11yAnnounce Angular.js service supplies two functions for use by the Angular
	 * application - politeAnnounce and assertiveAnnounce. politeAnnounce will announce using aria-live="polite"
	 * and assertiveAnnounce will announce using aria-live="assertive". The a11Announce service uses 4 divs,
	 * 2 for polite and 2 for assertive. This is to circumvent bugs in browsers that will stop announcing updates
	 * to the same div if these are too repetitive.
	 *
	 */

	module.factory('nga11yAnnounce', [function () {
		function makePolite(n) {
			var politeAnnouncer = angular.element('<div>').attr({
				'id': 'nga11y-politeannounce' + n,
				'role': 'log',
				'aria-live': 'polite',
				'aria-relevant': 'additions',
				'style': OFFSCREEN
			});
			angular.element(document.body).append(politeAnnouncer);
			return politeAnnouncer;
		}
		function makeAssertive(n) {
			var assertiveAnnouncer = angular.element('<div>').attr({
				'id': 'nga11y-assertiveannounce' + n,
				'role': 'log',
				'aria-live': 'assertive',
				'aria-relevant': 'additions',
				'style': OFFSCREEN
			});
			angular.element(document.body).append(assertiveAnnouncer);
			return assertiveAnnouncer;
		}
		var announceFactory = { number : 2, pIndex : 0, aIndex : 0 };
		var OFFSCREEN = 'border: 0;clip: rect(0 0 0 0);clip: rect(0, 0, 0, 0);' +
			'height: 1px;margin: -1px;overflow: hidden;padding: 0;' +
			'width: 1px;position: absolute;';

		announceFactory.politeAnnouncers = [];
		for (var i = 0; i < announceFactory.number; i++) {
			announceFactory.politeAnnouncers.push(makePolite(i));
		}
		announceFactory.assertiveAnnouncers = [];
		for (i = 0; i < announceFactory.number; i++) {
			announceFactory.assertiveAnnouncers.push(makeAssertive(i));
		}
		announceFactory.politeAnnounce = function (msg) {
			this.politeAnnouncers[this.pIndex].empty();
			this.pIndex += 1;
			this.pIndex = this.pIndex % this.number;
			this.politeAnnouncers[this.pIndex].append(angular.element('<p>').text(msg));
		};
		announceFactory.assertiveAnnounce = function (msg) {
			this.assertiveAnnouncers[this.aIndex].empty();
			this.aIndex += 1;
			this.aIndex = this.aIndex % this.number;
			this.assertiveAnnouncers[this.aIndex].append(angular.element('<p>').text(msg));
		};

		announceFactory.clearAssertive = function(){
			this.assertiveAnnouncers[this.aIndex].empty();
		}

		return announceFactory;
	}]);
}());
