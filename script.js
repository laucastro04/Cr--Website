// Mobile menu toggle + accessibility
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
}

function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
}

hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
});

// Close on link click (mobile)
mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
});

// Escape key closes
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

// Optional: set "active" underline when clicking desktop links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
    });
});

// ---- HOW IT WORKS: sticky slide animation ----
(function () {
  const stack = document.querySelector('.how-stack');
  const cards = Array.from(document.querySelectorAll('.how-card'));
  if (!stack || !cards.length) return;

  const rootStyle = getComputedStyle(document.documentElement);
  const peekPx = () =>
    parseFloat(getComputedStyle(stack).getPropertyValue('--peek')) || 20;

  function navOffsetPx() {
    const v = parseFloat(rootStyle.getPropertyValue('--nav-offset'));
    return Number.isFinite(v) ? v : 40;
  }

  function stickyTopPx() {
    // must match CSS: top: calc(var(--nav-offset) + 20px)
    return navOffsetPx() + 20;
  }

  function clamp01(x){ return x < 0 ? 0 : x > 1 ? 1 : x; }

  let ticking = false;
  function update() {
    const scrollY = window.scrollY;
    const stickyTop = stickyTopPx();
    const peek = peekPx();

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardTopDoc = rect.top + scrollY;
      const cardH = card.offsetHeight;

      // The card starts animating when its top hits the sticky line.
      const start = cardTopDoc - stickyTop;
      const dist  = (cardH - peek);      // how far we need to translate up
      const p = clamp01((scrollY - start) / dist);

      card.style.setProperty('--p', p.toFixed(4));
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  update();
})();

// countdown.js
(() => {
  // Target: Jan 1, 2026 at 12:00 PM (local time)
    const target = new Date(2026, 0, 1, 12, 0, 0); // months are 0-based

    const start = () => {
        const el = {
        days:  document.querySelector('.cd-days'),
        hours: document.querySelector('.cd-hours'),
        mins:  document.querySelector('.cd-mins'),
        secs:  document.querySelector('.cd-secs'),
        done:  document.querySelector('.countdown-done')
        };
        if (!el.days || !el.hours || !el.mins || !el.secs) return;

        const pad = (n, len = 2) => String(Math.max(0, n)).padStart(len, '0');

        function tick() {
        const now = new Date();
        let diff = target - now;

        if (diff <= 0) {
            el.days.textContent  = '00';
            el.hours.textContent = '00';
            el.mins.textContent  = '00';
            el.secs.textContent  = '00';
            if (el.done) el.done.hidden = false;
            clearInterval(timer);
            return;
        }

        const sec = 1000, min = 60 * sec, hr = 60 * min, day = 24 * hr;
        const d = Math.floor(diff / day);  diff %= day;
        const h = Math.floor(diff / hr);   diff %= hr;
        const m = Math.floor(diff / min);  diff %= min;
        const s = Math.floor(diff / sec);

        el.days.textContent  = d < 100 ? pad(d) : String(d);
        el.hours.textContent = pad(h);
        el.mins.textContent  = pad(m);
        el.secs.textContent  = pad(s);
        }

        tick();
        const timer = setInterval(tick, 1000);
    };

  // If file is loaded with `defer`, DOM is ready. Fallback guard just in case.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();

