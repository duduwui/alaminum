/**
 * High-performance Scroll Animation & Intersection Observer Engine for Doorhome
 * Automatically reveals elements with silky-smooth, luxury physics as the user scrolls into view.
 */

export function initScrollRevealObserver(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleIntersect: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.05
  });

  const observeAll = () => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.dh-reveal, .dh-reveal-left, .dh-reveal-right, .dh-reveal-zoom, .reveal-on-scroll'
    );
    targets.forEach((el) => {
      if (!el.classList.contains('is-revealed')) {
        observer.observe(el);
      }
    });
  };

  // Initial observe
  requestAnimationFrame(observeAll);

  // Observe dynamically mounted elements (e.g. tabs change, shop filter, language change)
  const mutationObserver = new MutationObserver(() => {
    requestAnimationFrame(observeAll);
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => {
    observer.disconnect();
    mutationObserver.disconnect();
  };
}
