describe('ngA11y announce', function() {
	var a11yAnnounceSvc;
	// Load the ngA11y module, which contains the service
	beforeEach(module('ngA11y'));
	beforeEach(inject(function (_a11yAnnounce_) {
		a11yAnnounceSvc = _a11yAnnounce_;
	}));
	afterEach(function () {
		document.body.innerHTML = '';
	});
	describe('setup', function () {
		it('Should create 2 divs for the polite announcements', function () {
			expect(document.getElementById('nga11y-politeannounce0')).not.toBe(undefined);
			expect(document.getElementById('nga11y-politeannounce1')).not.toBe(undefined);
		});
		it('Should create 2 divs for the assertive announcements', function () {
			expect(document.getElementById('nga11y-assertiveannounce0')).not.toBe(undefined);
			expect(document.getElementById('nga11y-assertiveannounce1')).not.toBe(undefined);
		});
		it('should have two utility functions', function () {
			expect(typeof a11yAnnounceSvc.politeAnnounce).toBe('function');
			expect(typeof a11yAnnounceSvc.assertiveAnnounce).toBe('function');
		});
	});
	describe('politeAnnounce', function () {
		it('should insert into the second polite div first when called', function () {
			a11yAnnounceSvc.politeAnnounce('hello');
			expect(document.getElementById('nga11y-politeannounce1').innerHTML).toBe('<p>hello</p>');
			expect(document.getElementById('nga11y-politeannounce0').firstChild).toBe(null);
		});
		it('should insert into the first polite div when called twice and delete the elements from the second', function () {
			a11yAnnounceSvc.politeAnnounce('hello');
			a11yAnnounceSvc.politeAnnounce('hello');
			expect(document.getElementById('nga11y-politeannounce0').innerHTML).toBe('<p>hello</p>');
			expect(document.getElementById('nga11y-politeannounce1').firstChild).toBe(null);
		});
	});
	describe('assertiveAnnounce', function () {
		it('should insert into the second assertive div first when called', function () {
			a11yAnnounceSvc.assertiveAnnounce('hello');
			expect(document.getElementById('nga11y-assertiveannounce1').innerHTML).toBe('<p>hello</p>');
			expect(document.getElementById('nga11y-assertiveannounce0').firstChild).toBe(null);
		});
		it('should insert into the first polite div when called twice and delete the elements from the second', function () {
			a11yAnnounceSvc.assertiveAnnounce('hello');
			a11yAnnounceSvc.assertiveAnnounce('hello');
			expect(document.getElementById('nga11y-assertiveannounce0').innerHTML).toBe('<p>hello</p>');
			expect(document.getElementById('nga11y-assertiveannounce1').firstChild).toBe(null);
		});
	});
});