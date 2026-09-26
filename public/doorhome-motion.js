/* Progressive motion: content stays visible if animation support is unavailable. */
(() => {
  if (window.__doorhomeMotion || !('IntersectionObserver' in window)) return;
  window.__doorhomeMotion = true;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet();
  const running = new Set();
  const overlays = '[role="dialog"], .doorhome-products-menu, [data-doorhome-drawer], .fixed.inset-0 > .shadow-2xl';
  const selector = 'main > *, main section[id], ' + overlays;
  function animate(element, kind = 'content') {
    if (preference.matches || !element.isConnected || typeof element.animate !== 'function') return;
    // Independent translate preserves layout transforms used by centered menus and card stacks.
    const offset = kind === 'drawer' ? (getComputedStyle(element).direction === 'rtl' ? '-22px 0' : '22px 0') : '0 14px';
    const animation = element.animate([{opacity: 0, translate: offset}, {opacity: 1, translate: '0 0'}], {
      duration: kind === 'drawer' ? 300 : 360,
      easing: 'cubic-bezier(.22,1,.36,1)',
      fill: 'none'
    });
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      animate(entry.target);
    }
  }, {threshold: 0.08});
  function register(element) {
    if (!(element instanceof HTMLElement) || seen.has(element)) return;
    // Avoid nested animations, video controls, and the fixed admin workspace.
    if (!element.matches(overlays) && (element.matches('.doorhome-admin-workspace') || element.closest('.doorhome-admin-workspace'))) return;
    seen.add(element);
    if (element.matches(overlays)) {
      animate(element, element.hasAttribute('data-doorhome-drawer') ? 'drawer' : 'content');
    } else if (!element.parentElement?.closest('main section[id]')) observer.observe(element);
  }
  function discover(root) {
    if (!(root instanceof Element)) return;
    if (root.matches(selector)) register(root);
    root.querySelectorAll(selector).forEach(register);
  }
  function start() {
    discover(document.getElementById('root'));
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'attributes') {
          const page = record.target.firstElementChild;
          if (page && !record.target.querySelector('.doorhome-admin-workspace')) animate(page);
          continue;
        }
        record.removedNodes.forEach(node => {
          if (node instanceof Element) {
            observer.unobserve(node);
            node.querySelectorAll(selector).forEach(element => observer.unobserve(element));
          }
        });
        record.addedNodes.forEach(discover);
      }
    }).observe(document.getElementById('root') || document.body, {childList:true,subtree:true,attributes:true,attributeFilter:['data-doorhome-page']});
  }
  preference.addEventListener('change', () => {
    if (preference.matches) running.forEach(animation => animation.cancel());
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
