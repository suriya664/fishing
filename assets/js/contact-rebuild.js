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
          .map((char) => `<span class="contact-hero-letter inline-block">${char}</span>`)
          .join('');
        return `<span class="inline-block whitespace-nowrap">${letters}</span>`;
      })
      .join('<span class="inline-block">&nbsp;</span>');
  }

  function initHero() {
    const section = document.querySelector('[data-contact-hero]');
    if (!section) {
      return;
    }

    const bg = document.getElementById('contact-hero-bg');
    const card = document.getElementById('contact-hero-card');
    const title = document.getElementById('contact-hero-title');
    const subtitle = document.getElementById('contact-hero-subtitle');
    const kicker = section.querySelector('.contact-hero-kicker');
    const lines = section.querySelectorAll('[data-frame-line]');
    const shimmer = section.querySelector('.contact-hero-shimmer');

    if (!bg || !card || !title || !subtitle || !kicker || !lines.length || !shimmer) {
      return;
    }

    splitHeroTitle(title);

    const tl = gsap.timeline();
    tl.fromTo(card, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.82, ease: 'power3.out' })
      .fromTo(
        lines,
        { opacity: 0.2 },
        { opacity: 0.9, duration: 0.26, stagger: 0.08, ease: 'power1.out' },
        0.12
      )
      .fromTo(
        '.contact-frame-top, .contact-frame-bottom',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.62, stagger: 0.1, ease: 'power2.out' },
        0.2
      )
      .fromTo(
        '.contact-frame-left, .contact-frame-right',
        { scaleY: 0 },
        { scaleY: 1, duration: 0.62, stagger: 0.1, ease: 'power2.out' },
        0.34
      )
      .fromTo(
        kicker,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        0.38
      )
      .fromTo(
        '#contact-hero-title .contact-hero-letter',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.68, stagger: 0.02, ease: 'power3.out' },
        0.46
      )
      .fromTo(
        subtitle,
        { opacity: 0, y: 16, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.62, ease: 'power2.out' },
        0.72
      );

    gsap.to(bg, {
      yPercent: 10,
      duration: 15,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.fromTo(
      shimmer,
      { backgroundPositionX: '0%' },
      { backgroundPositionX: '120%', duration: 7.5, ease: 'none', repeat: -1 }
    );
  }

  function initTimeline() {
    const section = document.querySelector('[data-contact-timeline]');
    if (!section) {
      return;
    }

    const progress = section.querySelector('.contact-time-progress');
    const steps = section.querySelectorAll('[data-time-step]');

    if (progress) {
      gsap.fromTo(
        progress,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%'
          }
        }
      );
    }

    if (steps.length) {
      gsap.fromTo(
        steps,
        { scale: 0.84, y: 24, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.16,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      );
    }
  }

  function initChannels() {
    const section = document.querySelector('[data-concierge-channels]');
    if (!section) {
      return;
    }

    const panels = section.querySelectorAll('[data-channel-panel]');
    if (!panels.length) {
      return;
    }

    gsap.fromTo(
      panels,
      { y: 38, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.78,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%'
        }
      }
    );
  }

  function initMarina() {
    const section = document.querySelector('[data-marina-presence]');
    if (!section) {
      return;
    }

    const image = document.getElementById('marina-image');
    const mask = section.querySelector('.marina-mask-wrap');
    const copy = section.querySelector('.marina-copy');

    if (mask) {
      gsap.fromTo(
        mask,
        { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', opacity: 0.2 },
        {
          clipPath: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)',
          opacity: 1,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      );
    }

    if (copy) {
      gsap.fromTo(
        copy,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      );
    }

    if (image && window.ScrollTrigger) {
      gsap.to(image, {
        xPercent: 10,
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

  function initPriority() {
    const section = document.querySelector('[data-priority-access]');
    if (!section) {
      return;
    }

    const formCard = document.getElementById('priority-form-card');
    const fishes = section.querySelectorAll('.priority-fish');

    if (formCard) {
      gsap.fromTo(
        formCard,
        { y: 58, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.88,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      );
    }

    fishes.forEach((fish, index) => {
      gsap.to(fish, {
        xPercent: index % 2 === 0 ? 14 : -14,
        yPercent: -10,
        duration: 14 + index * 2,
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

    initHero();
    initTimeline();
    initChannels();
    initMarina();
    initPriority();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
