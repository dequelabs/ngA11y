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

	module.directive('editableGrid',[function () {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: '<table role="grid" ng-transclude></table>',
			link: function (scope, element) {
				element.on('keydown', function (e) {
					var keyCode = e.which || e.keyCode;
					if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) {
						return;
					}
					var cell = e.target.parentNode;
					var parent = cell.parentNode;
					var row, table, prev, next;
					while (parent.nodeName !== 'BODY') {
						if (parent.nodeName === 'TR') {
							row = parent;
						}
						if (parent.nodeName === 'TABLE') {
							table = parent;
							break;
						}
						parent = parent.parentNode;
					}
					if (!table || !row) {
						return;
					}
					switch(keyCode) {
						case 38: // up
							prev = row.previousElementSibling || row.previousSibling;
							if (prev && prev.cells && prev.cells[cell.cellIndex].nodeName !== 'TH') {
								prev.cells[cell.cellIndex].firstChild.focus();
							}
							break;
						case 40: // down
							next = row.nextElementSibling || row.nextSibling;
							if (next && next.cells) {
								next.cells[cell.cellIndex].firstChild.focus();
							}
							break;
					}
				});
			}
		};
	}]);
	module.directive('editableGridRow',[function () {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: '<tr role="row" ng-transclude></tr>',
			link: function (scope, element) {
			}
		};
	}]);
	module.directive('editableGridCell',[function () {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: '<td role="cell" ng-transclude></td>',
			link: function (scope, element, attrs) {
				var input, table, row, firstRow, rowHeader, colHeader, labelledby,
					el = element[0],
					parent = el.parentNode;
				while (parent.nodeName !== 'BODY') {
					if (parent.nodeName === 'TR') {
						row = parent;
					}
					if (parent.nodeName === 'TABLE') {
						table = parent;
						break;
					}
					parent = parent.parentNode;
				}
				if (!table || !row) {
					return;
				}
				firstRow = table.rows[0];
				if (row !== firstRow && firstRow.cells[el.cellIndex].scope === 'col') {
					colHeader = firstRow.cells[el.cellIndex];
					if (!colHeader.id) {
						colHeader.id = 'id' + Math.random().toString().substring(2);
					}
				}
				if (row.cells[0].scope === 'row') {
					rowHeader = row.cells[0];
					if (!rowHeader.id) {
						rowHeader.id = 'id' + Math.random().toString().substring(2);
					}
				}
				if (table && row) {
					if (attrs.type) {
						switch(attrs.type) {
							case 'text':
								input = angular.element('<input type="text" />');
								labelledby = '';
								if (rowHeader) {
									labelledby += rowHeader.id;
								}
								if (colHeader) {
									if (labelledby) {
										labelledby += ' ';
									}
									labelledby += colHeader.id;									
								}
								if (labelledby) {
									input.attr('aria-labelledby', labelledby);
								}
								element.append(input);
								break;
						}
					}
				}
			}
		};
	}]);
	module.directive('editableColumnHeader',[function () {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: '<th role="cell" scope="col" ng-transclude></th>',
			link: function (scope, element) {
			}
		};
	}]);
	module.directive('editableRowHeader',[function () {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: '<th role="cell" scope="row" ng-transclude></th>',
			link: function (scope, element) {
			}
		};
	}]);
}());
