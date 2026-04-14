// Rex-25 PWA install banner
// Captures beforeinstallprompt and shows a custom in-page banner on mobile.

(function () {
  'use strict';

  var deferredPrompt = null;
  var banner = null;
  var btn = null;
  var DISMISS_KEY = 'rex25.installDismissed';

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
        || window.navigator.standalone === true;
  }

  function show() {
    if (!banner) return;
    if (isStandalone()) return;
    try { if (localStorage.getItem(DISMISS_KEY) === '1') return; } catch (e) {}
    banner.classList.add('show');
  }

  function hide() {
    if (banner) banner.classList.remove('show');
  }

  document.addEventListener('DOMContentLoaded', function () {
    banner = document.getElementById('install-banner');
    btn    = document.getElementById('install-btn');
    if (!banner || !btn) return;

    btn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
          hide();
        });
      } else {
        alert('On iOS: tap the Share icon, then "Add to Home Screen".');
        try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
        hide();
      }
    });
  });

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    show();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
    hide();
  });

  setTimeout(function () {
    if (!deferredPrompt && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      show();
    }
  }, 3000);
})();
