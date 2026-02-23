(function () {
  function hasGSAP() {
    return typeof window.gsap !== 'undefined';
  }

  function initCharterExperience() {
    const section = document.querySelector('[data-charter-experience]');
    if (!section) {
      return;
    }

    const bgImage = section.querySelector('.booking-experience-bg');
    const panel = section.querySelector('.booking-experience-panel');
    const items = section.querySelectorAll('[data-exp-item]');
    const cta = section.querySelector('.booking-exp-cta');

    if (bgImage) {
      gsap.fromTo(
        bgImage,
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

    if (window.ScrollTrigger && bgImage) {
      gsap.to(bgImage, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    const timelineConfig = window.ScrollTrigger
      ? {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      : {};

    const tl = gsap.timeline(timelineConfig);
    if (panel) {
      tl.fromTo(
        panel,
        { x: -72, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (items.length) {
      tl.fromTo(
        items,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out' },
        0.2
      );
    }

    if (cta) {
      tl.fromTo(
        cta,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
        0.5
      );
    }
  }

  function initReservationTimeline() {
    const section = document.querySelector('[data-reservation-timeline]');
    if (!section) {
      return;
    }

    const progress = section.querySelector('.booking-timeline-progress');
    const steps = section.querySelectorAll('[data-timeline-step]');
    const stepNumbers = section.querySelectorAll('[data-step-number]');

    if (progress) {
      if (window.ScrollTrigger) {
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 74%',
              end: 'bottom 45%',
              scrub: 1
            }
          }
        );
      } else {
        gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.out' });
      }
    }

    const timelineConfig = window.ScrollTrigger
      ? {
          scrollTrigger: {
            trigger: section,
            start: 'top 78%'
          }
        }
      : {};

    const tl = gsap.timeline(timelineConfig);
    if (stepNumbers.length) {
      tl.fromTo(
        stepNumbers,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.16, ease: 'back.out(1.8)' }
      );
    }

    if (steps.length) {
      tl.fromTo(
        steps,
        { y: 48, opacity: 0, rotate: 3 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
        0.08
      );
    }
  }

  function initEnhancements() {
    const section = document.querySelector('[data-enhancements-section]');
    if (!section) {
      return;
    }

    const cards = section.querySelectorAll('[data-enh-card]');
    const fishes = section.querySelectorAll('.enh-fish');

    const timelineConfig = window.ScrollTrigger
      ? {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        }
      : {};

    if (cards.length) {
      gsap.timeline(timelineConfig).fromTo(
        cards,
        { y: 56, opacity: 0, rotate: 3 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }

    fishes.forEach((fish, index) => {
      gsap.to(fish, {
        xPercent: index % 2 === 0 ? 10 : -10,
        yPercent: -8,
        duration: 15 + index * 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });
  }

  function init() {
    if (!hasGSAP()) {
      return;
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    initCharterExperience();
    initReservationTimeline();
    initEnhancements();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
