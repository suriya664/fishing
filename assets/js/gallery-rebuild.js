(function () {
  function hasGsap() {
    return typeof window.gsap !== 'undefined';
  }

  function splitTitleLetters(node) {
    if (!node) {
      return;
    }

    const raw = (node.textContent || '').trim();
    node.innerHTML = raw
      .split(/\s+/)
      .map((word) => {
        const letters = word
          .split('')
          .map((char) => `<span class="gallery-hero-letter inline-block">${char}</span>`)
          .join('');
        return `<span class="inline-block whitespace-nowrap">${letters}</span>`;
      })
      .join('<span class="inline-block">&nbsp;</span>');
  }

  function initHero() {
    const hero = document.querySelector('[data-gallery-hero]');
    if (!hero) {
      return;
    }

    const clip = document.getElementById('gallery-hero-clip');
    const image = document.getElementById('gallery-hero-image');
    const title = document.getElementById('gallery-hero-title');
    const subtitle = document.getElementById('gallery-hero-subtitle');
    const kicker = hero.querySelector('.gallery-hero-kicker');
    const accent = hero.querySelector('.gallery-hero-accent');
    const textStack = hero.querySelector('article > div');

    if (!clip || !image || !title || !subtitle || !kicker || !accent || !textStack) {
      return;
    }

    splitTitleLetters(title);
    gsap.set(clip, { clipPath: 'inset(0 100% 0 0 round 1.5rem)' });

    const tl = gsap.timeline();
    tl.fromTo(textStack, { x: -86, opacity: 0 }, { x: 0, opacity: 1, duration: 0.95, ease: 'power3.out' })
      .fromTo(
        clip,
        { x: 80, opacity: 0, clipPath: 'inset(0 100% 0 0 round 1.5rem)' },
        { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0 round 1.5rem)', duration: 1.05, ease: 'power4.out' },
        0.06
      )
      .fromTo(
        '#gallery-hero-title .gallery-hero-letter',
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.72, stagger: 0.02, ease: 'power3.out' },
        0.22
      )
      .fromTo(accent, { scaleX: 0 }, { scaleX: 1, duration: 0.64, ease: 'power2.out' }, 0.38)
      .fromTo(
        subtitle,
        { y: 14, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.64, ease: 'power2.out' },
        0.5
      );

    gsap.fromTo(
      image,
      { scale: 1.02 },
      {
        scale: 1.08,
        duration: 16,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      }
    );

    hero.addEventListener('mousemove', (event) => {
      const bounds = hero.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width - 0.5;
      const py = (event.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(image, { x: px * 20, y: py * 14, duration: 0.55, ease: 'power2.out' });
      gsap.to(textStack, { x: px * -10, y: py * -8, duration: 0.55, ease: 'power2.out' });
    });

    hero.addEventListener('mouseleave', () => {
      gsap.to(image, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' });
      gsap.to(textStack, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' });
    });
  }

  function initStoryGrid() {
    const section = document.querySelector('[data-story-grid]');
    if (!section) {
      return;
    }

    const rows = section.querySelectorAll('[data-story-row]');
    rows.forEach((row, index) => {
      const media = row.querySelector('.story-media');
      const copy = row.querySelector('.story-copy');
      const image = row.querySelector('.story-image');
      const from = row.getAttribute('data-direction') === 'right' ? 90 : -90;

      if (!media || !copy || !image) {
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 82%'
        }
      });

      tl.fromTo(media, { x: from, opacity: 0 }, { x: 0, opacity: 1, duration: 0.82, ease: 'power3.out' }).fromTo(
        copy,
        { x: from * -0.6, y: 18, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.74, ease: 'power2.out' },
        0.22
      );

      gsap.to(image, {
        yPercent: index % 2 === 0 ? 10 : -10,
        ease: 'none',
        scrollTrigger: {
          trigger: row,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  function bindTilt(cards) {
    cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const bounds = card.getBoundingClientRect();
        const px = (event.clientX - bounds.left) / bounds.width - 0.5;
        const py = (event.clientY - bounds.top) / bounds.height - 0.5;

        gsap.to(card, {
          rotationY: px * 10,
          rotationX: py * -10,
          transformPerspective: 900,
          transformOrigin: 'center center',
          duration: 0.35,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power3.out' });
      });
    });
  }

  function initCatchShowcase() {
    const section = document.querySelector('[data-catch-showcase]');
    if (!section) {
      return;
    }

    const cards = Array.from(section.querySelectorAll('[data-catch-card]'));
    const captions = section.querySelectorAll('.catch-caption');
    const tiltCards = section.querySelectorAll('[data-tilt]');
    const floatingCards = section.querySelectorAll('[data-floating]');

    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    gsap.fromTo(
      shuffled,
      {
        y: 56,
        opacity: 0,
        rotate: () => gsap.utils.random(-5, 5)
      },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.86,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo(
      captions,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 72%'
        }
      }
    );

    floatingCards.forEach((card, index) => {
      gsap.to(card, {
        y: gsap.utils.random(-16, -9),
        x: gsap.utils.random(-7, 7),
        duration: gsap.utils.random(4.8, 7.4),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: index * 0.2
      });
    });

    bindTilt(tiltCards);
  }

  function initFilmStrip() {
    const section = document.querySelector('[data-film-strip]');
    if (!section) {
      return;
    }

    const track = section.querySelector('.gallery-film-track');
    const frames = Array.from(section.querySelectorAll('[data-film-frame]'));

    if (!track || !frames.length) {
      return;
    }

    gsap.fromTo(
      frames,
      { y: 38, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.74,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%'
        }
      }
    );

    function setFocusByCenter() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = frames[0];
      let nearestDist = Number.POSITIVE_INFINITY;

      frames.forEach((frame) => {
        const frameCenter = frame.offsetLeft + frame.offsetWidth / 2;
        const dist = Math.abs(frameCenter - center);
        if (dist < nearestDist) {
          nearest = frame;
          nearestDist = dist;
        }
      });

      frames.forEach((frame) => frame.classList.remove('is-focus'));
      nearest.classList.add('is-focus');
    }

    let rafId = null;
    track.addEventListener('scroll', () => {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        setFocusByCenter();
        rafId = null;
      });
    });

    window.addEventListener('resize', setFocusByCenter);
    setTimeout(setFocusByCenter, 120);
  }

  function init() {
    if (!hasGsap()) {
      return;
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    initHero();
    initStoryGrid();
    initCatchShowcase();
    initFilmStrip();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
