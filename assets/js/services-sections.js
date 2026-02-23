(function () {
  function hasGsap() {
    return typeof window.gsap !== 'undefined';
  }

  function withScrollTrigger(config) {
    if (!window.ScrollTrigger) {
      return {};
    }

    return {
      scrollTrigger: config
    };
  }

  function initCharterTiers() {
    const section = document.querySelector('[data-charter-tiers]');
    if (!section) {
      return;
    }

    const image = section.querySelector('.tier-feature-image');
    const cards = section.querySelectorAll('[data-tier-card]');

    if (image) {
      gsap.fromTo(
        image,
        { scale: 1 },
        {
          scale: 1.08,
          duration: 20,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        }
      );
    }

    if (window.ScrollTrigger && image) {
      gsap.to(image, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9
        }
      });
    }

    if (!cards.length) {
      return;
    }

    gsap.fromTo(
      cards,
      { y: 40, opacity: 0, rotate: 3 },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.8,
        stagger: 0.16,
        ease: 'power3.out',
        ...withScrollTrigger({
          trigger: section,
          start: 'top 78%'
        })
      }
    );
  }

  function initConciergeEnhancements() {
    const section = document.querySelector('[data-concierge-enhancements]');
    if (!section) {
      return;
    }

    const cards = section.querySelectorAll('[data-con-card]');
    const fishes = section.querySelectorAll('.concierge-fish');

    if (cards.length) {
      const tl = gsap.timeline(
        withScrollTrigger({
          trigger: section,
          start: 'top 78%'
        })
      );

      cards.forEach((card, index) => {
        const dir = card.getAttribute('data-slide') === 'right' ? 68 : -68;
        tl.fromTo(
          card,
          { x: dir, y: 26, opacity: 0, rotate: index % 2 === 0 ? 2.6 : -2.6 },
          { x: 0, y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'power3.out' },
          index * 0.18
        );
      });
    }

    fishes.forEach((fish, index) => {
      gsap.to(fish, {
        xPercent: index % 2 === 0 ? 12 : -12,
        yPercent: -8,
        duration: 16 + index * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });
  }

  function runCounter(node) {
    const target = Number(node.getAttribute('data-target') || 0);
    const suffix = node.getAttribute('data-suffix') || '';
    const state = { value: 0 };

    gsap.to(state, {
      value: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        node.textContent = `${Math.round(state.value)}${suffix}`;
      },
      onComplete: () => {
        node.textContent = `${target}${suffix}`;
      }
    });
  }

  function initPerformancePrecision() {
    const section = document.querySelector('[data-performance-precision]');
    if (!section) {
      return;
    }

    const line = section.querySelector('.services-performance-line');
    const cards = section.querySelectorAll('[data-perf-card]');
    const counters = section.querySelectorAll('[data-counter]');

    const tl = gsap.timeline(
      withScrollTrigger({
        trigger: section,
        start: 'top 78%'
      })
    );

    if (line) {
      tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: 'power2.out' });
    }

    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.72, stagger: 0.14, ease: 'power2.out' },
        0.12
      );
    }

    if (window.ScrollTrigger && counters.length) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 76%',
        once: true,
        onEnter: () => counters.forEach((counter) => runCounter(counter))
      });
    } else {
      counters.forEach((counter) => runCounter(counter));
    }
  }

  function init() {
    if (!hasGsap()) {
      return;
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    initCharterTiers();
    initConciergeEnhancements();
    initPerformancePrecision();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
