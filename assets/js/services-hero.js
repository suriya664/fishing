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
          .map((char) => `<span class="services-hero-letter inline-block">${char}</span>`)
          .join('');
        return `<span class="services-hero-word inline-block whitespace-nowrap">${letters}</span>`;
      })
      .join('<span class="inline-block">&nbsp;</span>');
  }

  function initHeroAnimations() {
    const shell = document.querySelector('[data-services-hero]');
    const image = document.getElementById('services-hero-image');
    const title = document.getElementById('services-hero-title');
    const subtitle = document.getElementById('services-hero-subtitle');
    const line = shell ? shell.querySelector('.services-hero-line') : null;
    const kicker = shell ? shell.querySelector('.services-hero-kicker') : null;
    const ctaCard = document.getElementById('services-hero-cta');

    if (!shell || !window.gsap || !image || !title || !subtitle || !line || !kicker || !ctaCard) {
      return;
    }

    splitHeading(title);

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
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: shell,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    }

    const tl = gsap.timeline();
    tl.fromTo(
      kicker,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
    )
      .fromTo(
        '#services-hero-title .services-hero-letter',
        { y: 40, opacity: 0, letterSpacing: '0.08em' },
        { y: 0, opacity: 1, letterSpacing: '0em', duration: 0.72, stagger: 0.02, ease: 'power3.out' },
        0.16
      )
      .fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.68, ease: 'power2.out' },
        0.34
      )
      .fromTo(
        subtitle,
        { y: 18, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power2.out' },
        0.48
      )
      .fromTo(
        ctaCard,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0.58
      );
  }

  document.addEventListener('DOMContentLoaded', initHeroAnimations);
})();
