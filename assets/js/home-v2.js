(function () {
  function hasGsap() {
    return typeof window.gsap !== 'undefined';
  }

  function splitWords(node) {
    if (!node) {
      return;
    }

    const text = (node.textContent || '').trim();
    node.innerHTML = text
      .split(/\s+/)
      .map((word) => {
        const letters = word
          .split('')
          .map((char) => `<span class="hv2-hero-letter">${char}</span>`)
          .join('');
        return `<span class="hv2-hero-word">${letters}</span>`;
      })
      .join('<span class="inline-block">&nbsp;</span>');
  }

  function initHero() {
    const section = document.querySelector('[data-hv2-hero]');
    if (!section) {
      return;
    }

    const title = document.getElementById('hv2-hero-title');
    const subtitle = section.querySelector('.hv2-hero-subtitle');
    const kicker = section.querySelector('.hv2-hero-kicker');
    const copy = document.getElementById('hv2-hero-copy');
    const box = document.getElementById('hv2-floating-box');
    const diagonal = document.getElementById('hv2-diagonal-layer');
    const bg = document.getElementById('hv2-hero-bg');
    const depthA = document.getElementById('hv2-depth-a');
    const depthB = document.getElementById('hv2-depth-b');

    if (!title || !subtitle || !kicker || !copy || !box || !diagonal || !bg || !depthA || !depthB) {
      return;
    }

    splitWords(title);

    const tl = gsap.timeline();
    tl.fromTo(
      kicker,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
    )
      .fromTo(
        '#hv2-hero-title .hv2-hero-word',
        { y: 28, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.78, stagger: 0.08, ease: 'power3.out' },
        0.18
      )
      .fromTo(
        subtitle,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.56, ease: 'power2.out' },
        0.5
      )
      .fromTo(
        box,
        { y: 36, opacity: 0, rotate: -4 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.85, ease: 'power3.out' },
        0.36
      );

    gsap.to(box, {
      rotate: 2.2,
      y: -10,
      duration: 4.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.to(diagonal, {
      xPercent: 10,
      yPercent: -8,
      duration: 18,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    if (window.ScrollTrigger) {
      gsap.to(bg, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    section.addEventListener('mousemove', (event) => {
      const bounds = section.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width - 0.5;
      const py = (event.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(bg, { x: px * 18, y: py * 14, duration: 0.55, ease: 'power2.out' });
      gsap.to(copy, { x: px * -12, y: py * -8, duration: 0.5, ease: 'power2.out' });
      gsap.to(depthA, { x: px * -24, y: py * -16, duration: 0.6, ease: 'power2.out' });
      gsap.to(depthB, { x: px * 22, y: py * 15, duration: 0.6, ease: 'power2.out' });
    });

    section.addEventListener('mouseleave', () => {
      gsap.to([bg, copy, depthA, depthB], { x: 0, y: 0, duration: 0.65, ease: 'power3.out' });
    });
  }

  function initExpedition() {
    const section = document.querySelector('[data-hv2-expedition]');
    if (!section) {
      return;
    }

    const cards = section.querySelectorAll('[data-hv2-exp-img]');
    const underline = document.getElementById('hv2-exp-underline');

    if (underline) {
      gsap.to(underline, {
        width: '10rem',
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%'
        }
      });
    }

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { scale: 0.82, y: 54, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.92,
          ease: 'power3.out',
          delay: index * 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%'
          }
        }
      );

      // Disabled parallax to prevent overlap in Bento Grid layout
      /*
      if (window.ScrollTrigger) {
        gsap.to(card, {
          yPercent: index === 0 ? 8 : index === 1 ? -10 : 12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
      */
    });
  }

  function applyTilt(cards) {
    cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotationY: px * 9,
          rotationX: py * -9,
          transformPerspective: 900,
          transformOrigin: 'center center',
          duration: 0.32,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power3.out' });
      });
    });
  }

  function initFleet() {
    const section = document.querySelector('[data-hv2-fleet]');
    if (!section) {
      return;
    }

    const image = document.getElementById('hv2-fleet-image');
    const cards = section.querySelectorAll('[data-hv2-fleet-card]');

    if (image) {
      const desktopFleetMotion = window.matchMedia('(min-width: 1024px)').matches;
      if (desktopFleetMotion) {
        gsap.to(image, {
          x: 22,
          y: -10,
          duration: 8.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      } else {
        gsap.set(image, { x: 0, y: 0 });
      }
    }

    if (cards.length) {
      gsap.fromTo(
        cards,
        { x: 74, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      );
      applyTilt(cards);
    }
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

  function initStrip() {
    const section = document.querySelector('[data-hv2-strip]');
    if (!section) {
      return;
    }

    const sweep = section.querySelector('.hv2-strip-sweep');
    const counters = section.querySelectorAll('[data-hv2-counter]');
    const metrics = section.querySelectorAll('[data-hv2-metric]');

    if (sweep) {
      gsap.fromTo(
        sweep,
        { xPercent: -130 },
        {
          xPercent: 320,
          duration: 6.2,
          ease: 'none',
          repeat: -1
        }
      );
    }

    function startStripData() {
      counters.forEach((counter) => runCounter(counter));
      metrics.forEach((metric, index) => {
        setTimeout(() => metric.classList.add('is-live'), index * 130);
      });
    }

    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 76%',
        once: true,
        onEnter: startStripData
      });
    } else {
      startStripData();
    }
  }

  function initCircle() {
    const section = document.querySelector('[data-hv2-circle]');
    if (!section) {
      return;
    }

    const text = document.getElementById('hv2-circle-text');
    const photos = section.querySelectorAll('[data-hv2-circle-photo]');

    if (text) {
      gsap.fromTo(
        text,
        { x: -60, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        {
          x: 0,
          opacity: 1,
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      );
    }

    photos.forEach((photo, index) => {
      const rotateFrom = index === 0 ? -20 : 18;
      gsap.fromTo(
        photo,
        { y: 34, opacity: 0, rotate: rotateFrom },
        {
          y: 0,
          opacity: 1,
          rotate: index === 0 ? -6 : 7,
          duration: 0.88,
          ease: 'power3.out',
          delay: index * 0.14,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      );

      gsap.to(photo, {
        y: index === 0 ? -9 : -12,
        duration: 4.8 + index,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });
  }

  function initCta() {
    const section = document.querySelector('[data-hv2-cta]');
    if (!section) {
      return;
    }

    const image = document.getElementById('hv2-cta-image');
    const title = section.querySelector('.hv2-cta-title');
    const copy = section.querySelector('.hv2-cta-copy');

    if (!image || !title || !copy) {
      return;
    }

    gsap.fromTo(
      image,
      { scale: 1.08, filter: 'blur(8px) brightness(0.78)' },
      {
        scale: 1,
        filter: 'blur(0px) brightness(0.9)',
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%'
        }
      }
    );

    gsap.fromTo(
      [title, copy],
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.64,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 76%'
        }
      }
    );
  }

  function init() {
    if (!hasGsap()) {
      return;
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    initHero();
    initExpedition();
    initFleet();
    initStrip();
    initCircle();
    initCta();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
