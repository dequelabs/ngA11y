angular.module('demo', ['ngA11y'])
  .controller('DemoCtrl', ['nga11yAnnounce', function (nga11yAnnounce) {
    var vm = this;
    var count = 0;
    vm.view = 1;
    vm.modalOpen = false;
    vm.submitted = false;

    vm.polite = function () { nga11yAnnounce.politeAnnounce('Polite message ' + (++count)); };
    vm.assertive = function () { nga11yAnnounce.assertiveAnnounce('Assertive message ' + (++count)); };
    vm.swapView = function () { vm.view += 1; };
    vm.open = function () { vm.modalOpen = true; };
    vm.close = function () { vm.modalOpen = false; };
    vm.submit = function (form) { vm.submitted = form.$valid; };
  }])
  // Mirror the visually-hidden live regions into #live-log for sighted debugging.
  .run(function () {
    var log = document.getElementById('live-log');
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes, function (node) {
          var kind = m.target.getAttribute('aria-live');
          var line = document.createElement('div');
          line.textContent = '[' + kind + '] ' + node.textContent;
          log.appendChild(line);
        });
      });
    });
    setTimeout(function () {
      ['nga11y-politeannounce0', 'nga11y-politeannounce1', 'nga11y-assertiveannounce0', 'nga11y-assertiveannounce1']
        .forEach(function (id) {
          var el = document.getElementById(id);
          if (el) { observer.observe(el, { childList: true }); }
        });
    }, 0);
  });
