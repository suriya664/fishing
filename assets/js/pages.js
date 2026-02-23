(function () {
  function initSite() {
    if (window.SiteCore) {
      SiteCore.init();
    }

    initNavActiveState();
    initGenericReveal();
    initSimpleForms();
  }

  function initNavActiveState() {
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      const active = href === current || (current === '' && href === 'index.html');
      link.classList.toggle('nav-link-active', active);
    });
  }

  function initGenericReveal() {
    const nodes = document.querySelectorAll('[data-fade]');
    if (!nodes.length) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    nodes.forEach((node) => io.observe(node));
  }

  function initSimpleForms() {
    document.querySelectorAll('[data-demo-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.SiteCore) {
          SiteCore.toast('Form submitted. Backend endpoint required for production.', 'success');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initSite);
})();

