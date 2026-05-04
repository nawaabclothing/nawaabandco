/**
 * Nawab & Co. — Scroll & parallax animations
 *
 * Wires up IntersectionObserver for .nc-fade-in elements and a lightweight
 * rAF-based parallax for .nc-parallax-img elements inside lookbook grids.
 */

const initFadeIns = () => {
  const targets = document.querySelectorAll('.nc-fade-in:not(.nc-is-visible)');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('nc-is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
  );

  for (const el of targets) {
    observer.observe(el);
  }
};

const initParallax = () => {
  const imgs = document.querySelectorAll('.nc-parallax-img');
  if (!imgs.length) return;

  let ticking = false;

  const update = () => {
    for (const img of imgs) {
      const rect = img.closest('.nc-lookbook__item')?.getBoundingClientRect();
      if (!rect) continue;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const shift = (progress - 0.5) * 36;
      img.style.transform = `translateY(${shift}px) scale(1.12)`;
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
};

const init = () => {
  initFadeIns();
  initParallax();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* Re-run when the theme editor loads a section dynamically */
document.addEventListener('shopify:section:load', init);
