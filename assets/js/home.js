(function () {
  const heroTitles = [
    'REEL BEYOND LIMITS',
    'CONQUER THE OPEN SEA',
    'WHERE LEGENDS CAST THEIR LINES',
    'THE OCEAN IS CALLING',
    'UNBOUND ADVENTURE'
  ];

  const heroSubtitles = [
    'Bespoke offshore expeditions with elite captains, precision gear, and white-glove service.',
    'From sunrise pursuit to golden-hour return, every charter is engineered for unforgettable moments.',
    'Private luxury decks, real-time fish intelligence, and curated routes through premium waters.',
    'Chart your own tempo with tailored packages, gourmet onboard hospitality, and cinematic seascapes.',
    'Master the line, own the horizon, and return with stories worth retelling for generations.'
  ];

  function splitLetters(text) {
    return text
      .split('')
      .map((char) => {
        const safe = char === ' ' ? '&nbsp;' : char;
        return `<span class="inline-block letter">${safe}</span>`;
      })
      .join('');
  }

  function initHeroCycle() {
    const title = document.getElementById('hero-title');
    const subtitle = document.getElementById('hero-subtitle');
    const bookingBar = document.getElementById('hero-booking-bar');
    const image = document.getElementById('hero-image');

    if (!title || !subtitle || !window.gsap) {
      return;
    }

    let index = 0;

    if (image) {
      gsap.to(image, {
        scale: 1.16,
        duration: 9,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });
    }

    function render(indexToUse) {
      title.innerHTML = splitLetters(heroTitles[indexToUse]);
      subtitle.textContent = heroSubtitles[indexToUse];

      const tl = gsap.timeline();
      tl.fromTo(
        '#hero-title .letter',
        { y: 58, opacity: 0, rotateX: -80 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.028, duration: 0.72, ease: 'power3.out' }
      )
        .fromTo(
          subtitle,
          { opacity: 0, y: 24, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power2.out' },
          '-=0.32'
        )
        .fromTo(
          bookingBar,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.52, ease: 'power2.out' },
          '-=0.35'
        );

      if (image) {
        gsap.set(image, { scale: 1.06 });
      }
    }

    render(index);

    setInterval(() => {
      index = (index + 1) % heroTitles.length;
      gsap.to([title, subtitle, bookingBar], {
        opacity: 0,
        y: -12,
        duration: 0.36,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set([title, subtitle, bookingBar], { y: 0 });
          render(index);
        }
      });
    }, 6400);
  }

  function initParticles() {
    const host = document.getElementById('hero-particles');
    if (!host) {
      return;
    }

    for (let i = 0; i < 30; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'particle';
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.bottom = `${Math.random() * 40}%`;
      dot.style.animationDelay = `${Math.random() * 8}s`;
      dot.style.animationDuration = `${8 + Math.random() * 8}s`;
      host.appendChild(dot);
    }
  }

  function initScrollMotion() {
    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('[data-reveal]').forEach((node, i) => {
      gsap.fromTo(
        node,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i % 3 ? 0.05 : 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 86%'
          }
        }
      );
    });

    const routeCards = gsap.utils.toArray('[data-route-card]');
    const routeSection = document.querySelector('[data-routes-section]');
    if (routeCards.length) {
      gsap.fromTo(
        routeCards,
        { y: 52, opacity: 0, rotate: 2 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: routeSection || routeCards[0],
            start: 'top 82%'
          }
        }
      );
    }

    const crewCards = gsap.utils.toArray('[data-crew-card]');
    const crewSection = document.querySelector('[data-crew-section]');
    if (crewCards.length) {
      gsap.fromTo(
        crewCards,
        { y: 56, opacity: 0, rotate: 3 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: crewSection || crewCards[0],
            start: 'top 84%'
          }
        }
      );
    }

    gsap.utils.toArray('[data-crew-parallax]').forEach((node, idx) => {
      gsap.to(node, {
        yPercent: idx % 2 ? 14 : -12,
        xPercent: idx % 2 ? -6 : 6,
        ease: 'none',
        scrollTrigger: {
          trigger: crewSection || node,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    const voyageCards = gsap.utils.toArray('[data-voyage-card]');
    const voyageSection = document.querySelector('[data-voyages-section]');
    if (voyageCards.length) {
      gsap.fromTo(
        voyageCards,
        { y: 56, opacity: 0, rotate: 3 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: voyageSection || voyageCards[0],
            start: 'top 82%'
          }
        }
      );
    }

    gsap.utils.toArray('[data-voyage-parallax]').forEach((node, idx) => {
      gsap.to(node, {
        yPercent: idx % 2 ? 12 : -10,
        xPercent: idx % 2 ? -5 : 5,
        ease: 'none',
        scrollTrigger: {
          trigger: voyageSection || node,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    const stageCards = gsap.utils.toArray('[data-stage-card]');
    const stageSection = document.querySelector('[data-ocean-stage-section]');
    if (stageCards.length) {
      gsap.fromTo(
        stageCards,
        { y: 58, opacity: 0, rotate: 3, clipPath: 'inset(18% 0 18% 0 round 1.5rem)' },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          clipPath: 'inset(0% 0 0% 0 round 1.5rem)',
          duration: 0.85,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stageSection || stageCards[0],
            start: 'top 84%'
          }
        }
      );
    }

    gsap.utils.toArray('[data-stage-parallax]').forEach((node, idx) => {
      gsap.to(node, {
        yPercent: idx % 2 ? 13 : -11,
        xPercent: idx % 2 ? -7 : 6,
        ease: 'none',
        scrollTrigger: {
          trigger: stageSection || node,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  function initBookingBarActions() {
    const form = document.getElementById('quick-booking-form');
    if (!form) {
      return;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.SiteCore) {
        SiteCore.toast('Preferred charter details saved. Continue booking on the booking page.', 'success');
      }
      window.location.href = 'booking.html';
    });
  }

  function init() {
    initHeroCycle();
    initParticles();
    initScrollMotion();
    initBookingBarActions();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

