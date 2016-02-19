describe('editableGrid', function() {
	var $compile,
		$rootScope;
	// Load the ngA11y module, which contains the service
	beforeEach(module('ngA11y'));
	beforeEach(inject(function(_$compile_, _$rootScope_){
		// inject dependencies
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	afterEach(function () {
		document.body.innerHTML = '';
	});
	it('should replace the markup', function (done) {
		var cell, row, firstRow, firstCell;
		var element = $compile('<div><editable-grid>' +
			'<editable-grid-row>' +
			'<editable-grid-cell></editable-grid-cell>' +
			'<editable-column-header>header2</editable-column-header>' +
			'<editable-column-header>header3</editable-column-header>' +
			'</editable-grid-row>' +
			'<editable-grid-row>' +
			'<editable-row-header>row 1</editable-row-header>' +
			'<editable-grid-cell type="text"></editable-grid-cell>' +
			'<editable-grid-cell type="text"></editable-grid-cell>' +
			'</editable-grid-row>' +
			'<editable-grid-row>' +
			'<editable-row-header>row 2</editable-row-header>' +
			'<editable-grid-cell type="text"></editable-grid-cell>' +
			'<editable-grid-cell type="text"></editable-grid-cell>' +
			'</editable-grid-row>' +
			'</editable-grid></div>')($rootScope);
		var contents = element.contents();
		expect(contents[0].nodeName).toBe('TABLE');

		row = contents[0].firstChild;
		if (row.nodeName === 'TBODY') {
			row = row.firstChild;
		}
		firstRow = row;
		expect(row.nodeName).toBe('TR');
		cell = row.firstChild;
		expect(cell.nodeName).toBe('TD');
		cell = cell.nextSibling;
		expect(cell.nodeName).toBe('TH');
		expect(typeof cell.id).toBe('string');
		cell = cell.nextSibling;
		expect(cell.nodeName).toBe('TH');
		expect(typeof cell.id).toBe('string');

		row = row.nextSibling;
		expect(row.nodeName).toBe('TR');
		cell = row.firstChild;
		firstCell = cell;
		expect(cell.nodeName).toBe('TH');
		expect(typeof cell.id).toBe('string');

		cell = cell.nextSibling;
		expect(cell.nodeName).toBe('TD');
		input = cell.firstChild;
		expect(input.getAttribute('aria-labelledby').indexOf(firstCell.id.toString())).not.toBe(-1);
		expect(input.getAttribute('aria-labelledby').indexOf(firstRow.cells[cell.cellIndex].id.toString())).not.toBe(-1);

		cell = cell.nextSibling;
		expect(cell.nodeName).toBe('TD');
		input = cell.firstChild;
		expect(input.getAttribute('aria-labelledby').indexOf(firstCell.id.toString())).not.toBe(-1);
		expect(input.getAttribute('aria-labelledby').indexOf(firstRow.cells[cell.cellIndex].id.toString())).not.toBe(-1);

		row = row.nextSibling;
		expect(row.nodeName).toBe('TR');
		cell = row.firstChild;
		firstCell = cell;
		expect(cell.nodeName).toBe('TH');
		expect(typeof cell.id).toBe('string');

		cell = cell.nextSibling;
		expect(cell.nodeName).toBe('TD');
		input = cell.firstChild;
		expect(input.getAttribute('aria-labelledby').indexOf(firstCell.id.toString())).not.toBe(-1);
		expect(input.getAttribute('aria-labelledby').indexOf(firstRow.cells[cell.cellIndex].id.toString())).not.toBe(-1);

		cell = cell.nextSibling;
		expect(cell.nodeName).toBe('TD');
		input = cell.firstChild;
		expect(input.getAttribute('aria-labelledby').indexOf(firstCell.id.toString())).not.toBe(-1);
		expect(input.getAttribute('aria-labelledby').indexOf(firstRow.cells[cell.cellIndex].id.toString())).not.toBe(-1);
		document.body.appendChild(element[0]);
		axe.a11yCheck(element, function (results) {
			console.log('TestCase: Transclusion works')
			document.body.removeChild(element[0]);
			expect(results.violations.length).toBe(0);
			done();
		});
	});
	it('keyboard navigation should work', function (done) {
		var element = $compile('<div><a href="#"></a><editable-grid>' +
			'<editable-grid-row>' +
			'<editable-grid-cell></editable-grid-cell>' +
			'<editable-column-header>header2</editable-column-header>' +
			'<editable-column-header>header3</editable-column-header>' +
			'</editable-grid-row>' +
			'<editable-grid-row>' +
			'<editable-row-header>row 1</editable-row-header>' +
			'<editable-grid-cell type="text"></editable-grid-cell>' +
			'<editable-grid-cell type="text"></editable-grid-cell>' +
			'</editable-grid-row>' +
			'<editable-grid-row>' +
			'<editable-row-header>row 2</editable-row-header>' +
			'<editable-grid-cell type="text"></editable-grid-cell>' +
			'<editable-grid-cell type="text"></editable-grid-cell>' +
			'</editable-grid-row>' +
			'</editable-grid></div>')($rootScope);
		jQuery(document.body).append(element);
		var inputs = jQuery('input');
		inputs[0].focus();
		var evt = jQuery.Event('keydown');
		evt.which = 40;
		jQuery(inputs[0]).trigger(evt);
		expect(document.activeElement).toBe(jQuery(inputs[2])[0]);
		evt = jQuery.Event('keydown');
		evt.which = 38;
		jQuery(inputs[2]).trigger(evt);
		expect(document.activeElement).toBe(jQuery(inputs[0])[0]);
		document.body.appendChild(element[0]);
		axe.a11yCheck(element, function (results) {
			document.body.removeChild(element[0]);
			// expect(results.violations.length).toBe(0);
			expect(results.violations.length).toBe(1);
			expect(results.violations[0].id).toBe('link-name');
			expect(results.violations[0].nodes.length).toBe(1);
			expect(results.violations[0].nodes[0].target[0]).toBe('body > .ng-scope > a');
			done();
		});
	});
});
