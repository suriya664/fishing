(function () {
  function hasGsap() {
    return typeof window.gsap !== 'undefined';
  }

  function splitHeroTitle(node) {
    if (!node) {
      return;
    }

    const text = (node.textContent || '').trim();
    node.innerHTML = text
      .split(/\s+/)
      .map((word) => {
        const letters = word
          .split('')
          .map((char) => `<span class="blog-hero-letter inline-block">${char}</span>`)
          .join('');
        return `<span class="inline whitespace-nowrap">${letters}</span>`;
      })
      .join(' ');
  }

  function initEditorialHero() {
    const section = document.querySelector('[data-blog-hero]');
    if (!section) {
      return;
    }

    const mask = document.getElementById('blog-hero-mask');
    const image = document.getElementById('blog-hero-image');
    const title = document.getElementById('blog-hero-title');
    const subtitle = document.getElementById('blog-hero-subtitle');
    const kicker = section.querySelector('.blog-hero-kicker');
    const vert = section.querySelector('.blog-hero-vert');

    if (!mask || !image || !title || !subtitle || !kicker || !vert) {
      return;
    }

    splitHeroTitle(title);

    const tl = gsap.timeline();
    tl.fromTo(
      mask,
      { clipPath: 'inset(100% 0 0 0 round 1.5rem)', y: 90 },
      { clipPath: 'inset(0% 0 0 0 round 1.5rem)', y: 0, duration: 1.15, ease: 'power4.out' }
    )
      .fromTo(
        image,
        { filter: 'grayscale(100%) saturate(0.8)', scale: 1.13 },
        { filter: 'grayscale(0%) saturate(1)', scale: 1.02, duration: 1.2, ease: 'power2.out' },
        0.05
      )
      .fromTo(
        kicker,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.12
      )
      .fromTo(
        vert,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.75, ease: 'power3.out' },
        0.2
      )
      .fromTo(
        '#blog-hero-title .blog-hero-letter',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.72, stagger: 0.018, ease: 'power3.out' },
        0.28
      )
      .fromTo(
        subtitle,
        { y: 18, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.64, ease: 'power2.out' },
        0.52
      );

    if (window.ScrollTrigger) {
      gsap.to(image, {
        xPercent: 9,
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  }

  function initSpotlight() {
    const section = document.querySelector('[data-blog-spotlight]');
    if (!section) {
      return;
    }

    const image = document.getElementById('blog-spotlight-image');
    const badge = document.getElementById('spotlight-badge');
    const wave = section.querySelector('.spotlight-wave');
    const title = section.querySelector('.spotlight-title');

    if (!image || !badge || !wave || !title) {
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 78%'
      }
    });

    tl.fromTo(
      image,
      { scale: 1.16, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 1.05, ease: 'power3.out' }
    )
      .fromTo(
        badge,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
        0.22
      )
      .fromTo(
        title,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.62, ease: 'power2.out' },
        0.34
      );

    gsap.to(wave, {
      backgroundPositionX: '260px',
      duration: 12,
      ease: 'none',
      repeat: -1
    });
  }

  function bindArchiveTilt(cards) {
    cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotationY: px * 9,
          rotationX: py * -8,
          transformPerspective: 920,
          transformOrigin: 'center center',
          boxShadow: `${-px * 30}px ${18 + py * 24}px 58px rgba(14, 42, 58, 0.32)`,
          duration: 0.32,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          boxShadow: '0 18px 54px rgba(14, 42, 58, 0.24)',
          duration: 0.48,
          ease: 'power3.out'
        });
      });
    });
  }

  function initArchiveGrid() {
    const section = document.querySelector('[data-blog-archive]');
    if (!section) {
      return;
    }

    const cards = Array.from(section.querySelectorAll('[data-archive-card]'));
    if (!cards.length) {
      return;
    }

    const randomized = [...cards].sort(() => Math.random() - 0.5);
    gsap.fromTo(
      randomized,
      {
        y: 62,
        opacity: 0,
        rotate: () => gsap.utils.random(-4.5, 4.5)
      },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%'
        }
      }
    );

    bindArchiveTilt(cards);
  }

  function runCounter(node) {
    const target = Number(node.getAttribute('data-target') || 0);
    const suffix = node.getAttribute('data-suffix') || '';
    const state = { value: 0 };

    gsap.to(state, {
      value: target,
      duration: 1.9,
      ease: 'power2.out',
      onUpdate: () => {
        node.textContent = `${Math.round(state.value)}${suffix}`;
      },
      onComplete: () => {
        node.textContent = `${target}${suffix}`;
      }
    });
  }

  function initDataStrip() {
    const section = document.querySelector('[data-blog-data-strip]');
    if (!section) {
      return;
    }

    const metrics = section.querySelectorAll('[data-metric]');
    const counters = section.querySelectorAll('[data-counter]');
    const fills = section.querySelectorAll('[data-progress-fill]');

    gsap.fromTo(
      metrics,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%'
        }
      }
    );

    function startMetrics() {
      counters.forEach((counter) => runCounter(counter));

      fills.forEach((fill) => {
        const target = Number(fill.getAttribute('data-progress-target') || 0);
        gsap.to(fill, {
          width: `${target}%`,
          duration: 1.4,
          ease: 'power2.out'
        });
      });

      metrics.forEach((metric, index) => {
        setTimeout(() => metric.classList.add('is-live'), 140 * index);
      });
    }

    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 76%',
        once: true,
        onEnter: startMetrics
      });
    } else {
      startMetrics();
    }
  }

  function initDispatch() {
    const section = document.querySelector('[data-blog-dispatch]');
    if (!section) {
      return;
    }

    const panel = document.getElementById('blog-dispatch-panel');
    const fishes = section.querySelectorAll('.dispatch-fish');

    if (panel) {
      gsap.fromTo(
        panel,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%'
          }
        }
      );
    }

    fishes.forEach((fish, index) => {
      gsap.to(fish, {
        xPercent: index % 2 === 0 ? 14 : -14,
        yPercent: -10,
        duration: 15 + index * 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });
  }

  function init() {
    if (!hasGsap()) {
      return;
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    initEditorialHero();
    initSpotlight();
    initArchiveGrid();
    initDataStrip();
    initDispatch();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
