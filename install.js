(function () {
  'use strict';

  const banner = document.querySelector('#installBanner');
  const installButton = document.querySelector('#installAppButton');
  const dismissButton = document.querySelector('#installDismissButton');
  const iosHelp = document.querySelector('#installIosHelp');
  const DISMISS_KEY = 'tp_solver_install_dismissed_at';
  const DISMISS_DAYS = 7;
  let deferredPrompt = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const isIos = () =>
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

  function recentlyDismissed() {
    try {
      const savedAt = Number(localStorage.getItem(DISMISS_KEY));
      return Number.isFinite(savedAt) && savedAt > 0 &&
        Date.now() - savedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch (error) {
      return false;
    }
  }

  // The banner is fixed at the top, so tell the page how tall it is and push the app down.
  function updateOffset() {
    document.documentElement.style.setProperty(
      '--install-banner-h', banner && !banner.hidden ? banner.offsetHeight + 'px' : '0px');
    window.dispatchEvent(new Event('tp-layout-changed'));
  }

  function showBanner() {
    if (!banner || isStandalone() || recentlyDismissed()) return;
    banner.hidden = false;
    document.body.classList.add('has-install-banner');
    updateOffset();
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    iosHelp.hidden = true;
    document.body.classList.remove('has-install-banner');
    updateOffset();
  }

  window.addEventListener('resize', updateOffset);
  // Text can change size when the language changes or the iPhone steps open.
  if (window.ResizeObserver && banner) new ResizeObserver(updateOffset).observe(banner);

  // Register the service worker (needed for the app to be installable and to work offline).
  if ('serviceWorker' in navigator && (window.isSecureContext || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((error) => {
        console.warn('TP Solver offline support could not be enabled:', error);
      });
    });
  }

  // Chrome, Edge, Samsung Internet, Opera: the browser tells us the app can be installed.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showBanner();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideBanner();
  });

  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch (error) {
        // The prompt was closed without a choice.
      }
      deferredPrompt = null;
      hideBanner();
      return;
    }
    // iPhone/iPad Safari cannot install with one tap, so show the manual steps.
    iosHelp.hidden = !iosHelp.hidden;
  });

  dismissButton.addEventListener('click', () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch (error) {
      // Storage is unavailable; the banner will return on the next visit.
    }
    hideBanner();
  });

  // iOS Safari never fires beforeinstallprompt, so show the banner with instructions instead.
  if (isIos() && !isStandalone()) showBanner();
})();
