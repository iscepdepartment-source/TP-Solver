(function () {
  'use strict';

  // Recolors the Noupe "TP Buddy" chat launcher (and its chat header) from bright blue to the
  // app's dark blue. It only touches bright-blue backgrounds, so anything already dark is left alone.
  // Note: if Noupe renders the widget inside a cross-origin iframe, browsers do not allow a page
  // to restyle it. In that case set the widget color to #0b2a6b in the Noupe dashboard instead.

  var DARK_BLUE = '#0b2a6b';
  var watched = new WeakSet();

  function parseColor(value) {
    var match = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/.exec(value || '');
    if (!match) return null;
    return { r: +match[1], g: +match[2], b: +match[3], a: match[4] === undefined ? 1 : +match[4] };
  }

  function isBrightBlue(color) {
    return Boolean(color) && color.a > 0.5 && color.b >= 170 && color.b - color.r >= 70 && color.b - color.g >= 30;
  }

  function gradientHasBrightBlue(image) {
    var found = false;
    (image || '').replace(/rgba?\([^)]*\)/g, function (token) {
      if (isBrightBlue(parseColor(token))) found = true;
      return token;
    });
    return found;
  }

  function paint(element) {
    var style;
    try { style = window.getComputedStyle(element); } catch (error) { return false; }
    var changed = false;
    if (isBrightBlue(parseColor(style.backgroundColor))) {
      element.style.setProperty('background-color', DARK_BLUE, 'important');
      changed = true;
    }
    if (style.backgroundImage && style.backgroundImage !== 'none' && gradientHasBrightBlue(style.backgroundImage)) {
      element.style.setProperty('background-image', 'none', 'important');
      element.style.setProperty('background-color', DARK_BLUE, 'important');
      changed = true;
    }
    if (isBrightBlue(parseColor(style.borderTopColor)) && parseFloat(style.borderTopWidth) > 0) {
      element.style.setProperty('border-color', DARK_BLUE, 'important');
      changed = true;
    }
    return changed;
  }

  function walk(root, depth) {
    var changed = false;
    if (!root || depth > 6) return changed;
    var children = root.children || [];
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.nodeType !== 1) continue;
      if (paint(child)) changed = true;
      if (child.shadowRoot) changed = walk(child.shadowRoot, depth + 1) || changed;
      changed = walk(child, depth + 1) || changed;
    }
    return changed;
  }

  function nearBottomRight(element) {
    var style;
    try { style = window.getComputedStyle(element); } catch (error) { return false; }
    if (style.position !== 'fixed') return false;
    var rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return window.innerWidth - rect.right < 200 && window.innerHeight - rect.bottom < 200;
  }

  function watch(container) {
    if (watched.has(container) || !window.MutationObserver) return;
    watched.add(container);
    var timer = null;
    var observer = new MutationObserver(function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        paint(container);
        walk(container, 0);
        if (container.shadowRoot) walk(container.shadowRoot, 0);
      }, 80);
    });
    observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    if (container.shadowRoot) {
      observer.observe(container.shadowRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }
  }

  function scan() {
    var nodes = document.body ? document.body.children : [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.id === 'installBanner' || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') continue;
      // The widget host is a fixed element in the bottom-right corner, or contains one.
      var hosts = [node];
      if (node.shadowRoot) hosts.push.apply(hosts, node.shadowRoot.children);
      hosts.push.apply(hosts, node.children);
      for (var h = 0; h < hosts.length; h++) {
        var host = hosts[h];
        if (!host || host.nodeType !== 1) continue;
        if (nearBottomRight(host) || (host.shadowRoot && nearBottomRight(node))) {
          paint(host);
          walk(host, 0);
          if (host.shadowRoot) walk(host.shadowRoot, 0);
          watch(host);
        }
      }
    }
  }

  function start() {
    scan();
    // The widget loads late, so look again for a while, then keep watching new page-level elements.
    var runs = 0;
    var interval = window.setInterval(function () {
      scan();
      if (++runs >= 40) window.clearInterval(interval);
    }, 500);
    if (window.MutationObserver && document.body) {
      new MutationObserver(function () { scan(); }).observe(document.body, { childList: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
