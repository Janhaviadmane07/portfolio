/**
 * Portfolio Animation Controller
 * GPU-accelerated, accessibility-aware animation suite.
 * Import this in main.js AFTER DOMContentLoaded.
 */

export function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------------------------------
  // 1. SCROLL PROGRESS BAR
  // ----------------------------------------------------------------
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  progressBar.id = 'scrollProgressBar';
  document.body.prepend(progressBar);

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ----------------------------------------------------------------
  // 2. FLOATING BACKGROUND ORBS
  // ----------------------------------------------------------------
  if (!prefersReducedMotion) {
    const orbContainer = document.createElement('div');
    orbContainer.setAttribute('aria-hidden', 'true');
    orbContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    ['orb-1', 'orb-2', 'orb-3'].forEach(cls => {
      const orb = document.createElement('div');
      orb.className = `floating-orb ${cls}`;
      orbContainer.appendChild(orb);
    });
    document.body.prepend(orbContainer);
  }

  // ----------------------------------------------------------------
  // 3. AMBIENT FLOATING PARTICLES
  // ----------------------------------------------------------------
  if (!prefersReducedMotion) {
    const PARTICLE_COUNT = 12;
    const colors = [
      'rgba(102,126,234,0.4)',
      'rgba(118,75,162,0.4)',
      'rgba(236,72,153,0.35)',
      'rgba(255,255,255,0.25)',
    ];

    const particleHost = document.createElement('div');
    particleHost.setAttribute('aria-hidden', 'true');
    particleHost.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden;';

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 6 + 2; // 2-8px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = Math.random() * 5 + 3; // 3-8s
      const delay = Math.random() * -8;
      const leftPos = Math.random() * 100;
      const xDrift = (Math.random() - 0.5) * 120;

      p.className = 'ambient-particle';
      p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${color};
        left:${leftPos}%;
        animation: ambientFloat ${duration}s ${delay}s ease-in-out infinite;
        --x-drift: ${xDrift}px;
      `;
      particleHost.appendChild(p);
    }
    document.body.prepend(particleHost);
  }

  // ----------------------------------------------------------------
  // 4. RIPPLE EFFECT ON BUTTONS & LINKS
  // ----------------------------------------------------------------
  const rippleTargets = document.querySelectorAll(
    '.btn, .contact-card-btn, .social-pill-link, .filter-btn, .project-tab-btn, .nav-link'
  );

  rippleTargets.forEach(el => {
    el.classList.add('ripple-container');
    el.addEventListener('click', function(e) {
      if (prefersReducedMotion) return;

      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // ----------------------------------------------------------------
  // 5. BUTTON PRESS TACTILE FEEDBACK (mousedown/up)
  // ----------------------------------------------------------------
  document.querySelectorAll('.btn, .contact-card-btn, .filter-btn, .project-tab-btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      if (prefersReducedMotion) return;
      btn.style.transform = 'scale(0.95)';
      btn.style.transition = 'transform 0.05s ease';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
      btn.style.transition = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = '';
    });
  });

  // ----------------------------------------------------------------
  // 6. SMOOTH SCROLL FOR NAV LINKS (enhanced easing)
  // ----------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const targetY = target.getBoundingClientRect().top + window.scrollY - 75;

      if (prefersReducedMotion) {
        window.scrollTo({ top: targetY });
        return;
      }

      // Custom smooth easing (ease-in-out)
      const startY = window.scrollY;
      const distance = targetY - startY;
      const duration = 600;
      let startTime = null;

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  });

  // ----------------------------------------------------------------
  // 7. COUNTER FINISH CLASS
  //    Add visual emphasis class when counter reaches target
  // ----------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'), 10);
    const mo = new MutationObserver(() => {
      const current = parseInt(stat.textContent, 10);
      if (current >= target) {
        stat.classList.add('count-done');
        mo.disconnect();
      }
    });
    mo.observe(stat, { childList: true, subtree: true, characterData: true });
  });

  // ----------------------------------------------------------------
  // 11. PARALLAX — Hero particles layer moves at 30% scroll speed
  // ----------------------------------------------------------------
  if (!prefersReducedMotion) {
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroParticles.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
      }, { passive: true });
    }
  }

  // ----------------------------------------------------------------
  // 12. SECTION BACKGROUND PARALLAX (subtle)
  // ----------------------------------------------------------------
  if (!prefersReducedMotion) {
    const parallaxSections = document.querySelectorAll('.hero-section');
    const raf = { id: null };

    window.addEventListener('scroll', () => {
      cancelAnimationFrame(raf.id);
      raf.id = requestAnimationFrame(() => {
        parallaxSections.forEach(section => {
          const rect = section.getBoundingClientRect();
          const scrolled = -rect.top * 0.15;
          section.style.backgroundPositionY = `calc(50% + ${scrolled}px)`;
        });
      });
    }, { passive: true });
  }

  // ----------------------------------------------------------------
  // 13. HAMBURGER MENU BACKDROP
  //     Clicking outside closes mobile menu
  // ----------------------------------------------------------------
  const navMenu = document.getElementById('navMenu');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  if (navMenu && hamburgerBtn) {
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // ----------------------------------------------------------------
  // 14. AMBIENT PARTICLE X-DRIFT (apply CSS custom property via keyframes workaround)
  // ----------------------------------------------------------------
  // Using a style tag to inject dynamic keyframes isn't practical;
  // instead we randomize transform via JS animation for ambient particles.
  if (!prefersReducedMotion) {
    document.querySelectorAll('.ambient-particle').forEach(p => {
      const xDrift = (Math.random() - 0.5) * 120;
      const yStart = Math.random() * 100;
      const size = parseFloat(p.style.width);
      const duration = (Math.random() * 5 + 3) * 1000;
      const delay = Math.random() * -8000;

      function animateParticle(start) {
        const elapsed = start + Math.abs(delay);
        const progress = ((elapsed % duration) + duration) % duration / duration;
        const y = window.innerHeight + 100 - (window.innerHeight + 200) * progress;
        const x = parseFloat(p.style.left) + xDrift * Math.sin(progress * Math.PI * 2);
        const opacity = progress < 0.05 ? progress / 0.05 * 0.5
                       : progress > 0.95 ? (1 - progress) / 0.05 * 0.3
                       : 0.3 + Math.sin(progress * Math.PI) * 0.2;
        p.style.cssText = `
          width:${size}px; height:${size}px;
          position:fixed;
          border-radius:50%;
          pointer-events:none;
          z-index:0;
          background:${p.dataset.color || 'rgba(102,126,234,0.4)'};
          left:${x}%;
          top:${y}px;
          opacity:${opacity};
          will-change:transform,opacity;
        `;
      }

      // We let CSS animations handle this (set in CSS), so skip JS override.
      // Just ensure the particle has correct left position.
    });
  }

  console.log('[Animations] Portfolio animation system initialized.');
}
