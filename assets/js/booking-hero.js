(function () {
  function splitHeading(node) {
    if (!node) {
      return;
    }

    const text = (node.textContent || '').trim();
    node.innerHTML = text
      .split(/\s+/)
      .map((word) => {
        const letters = word
          .split('')
          .map((char) => `<span class="booking-hero-letter inline-block">${char}</span>`)
          .join('');
        return `<span class="booking-hero-word inline-block whitespace-nowrap">${letters}</span>`;
      })
      .join('<span class="inline-block">&nbsp;</span>');
  }

  function initHeroAnimations() {
    const hero = document.querySelector('[data-booking-hero]');
    const image = document.getElementById('booking-hero-image');
    const panel = document.getElementById('booking-hero-panel');
    const heading = document.getElementById('booking-hero-title');
    const subtitle = document.getElementById('booking-hero-subtitle');
    const kicker = document.querySelector('.booking-hero-kicker');

    if (!hero || !window.gsap || !panel || !heading || !subtitle || !image) {
      return;
    }

    splitHeading(heading);

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

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

    if (window.ScrollTrigger) {
      gsap.to(image, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    const isMobile = window.innerWidth < 768;
    const tl = gsap.timeline();
    tl.fromTo(
      panel,
      { x: isMobile ? 24 : 82, y: 12, opacity: 0, rotate: isMobile ? 1 : 3 },
      { x: 0, y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        kicker,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
        0.22
      )
      .fromTo(
        '#booking-hero-title .booking-hero-letter',
        { opacity: 0, y: 36, letterSpacing: '0.1em' },
        { opacity: 1, y: 0, letterSpacing: '0em', duration: 0.72, stagger: 0.02, ease: 'power3.out' },
        0.26
      )
      .fromTo(
        subtitle,
        { opacity: 0, y: 16, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power2.out' },
        0.66
      );
  }

  function initQuickShortcut() {
    const shortcutBtn = document.querySelector('[data-open-booking-shortcut]');
    const modalTrigger = document.getElementById('open-booking-modal');

    if (!shortcutBtn || !modalTrigger) {
      return;
    }

    shortcutBtn.addEventListener('click', () => {
      modalTrigger.click();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initQuickShortcut();
  });
})();
