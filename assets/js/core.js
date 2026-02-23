(function () {
  const THEME_KEY = 'fcb_theme';
  const DIR_KEY = 'fcb_dir';
  const OVERFLOW_LINKS = new Set(['dashboard.html', 'login.html', 'signup.html']);

  function normalizeHref(href) {
    return (href || '').split('#')[0].split('?')[0].toLowerCase();
  }

  function getThemeToggleMarkup() {
    return [
      '<span class="theme-icon theme-icon-moon" aria-hidden="true">',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">',
      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7.1 7.1 0 0 0 9.8 9.8z" />',
      '</svg>',
      '</span>',
      '<span class="theme-icon theme-icon-sun" aria-hidden="true">',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">',
      '<circle cx="12" cy="12" r="4" />',
      '<path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" stroke-linecap="round" />',
      '</svg>',
      '</span>',
      '<span class="sr-only" data-theme-label></span>'
    ].join('');
  }

  function getMenuToggleMarkup() {
    return [
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">',
      '<path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />',
      '</svg>',
      '<span class="sr-only">Toggle navigation menu</span>'
    ].join('');
  }

  function getMoreMenuMarkup() {
    return [
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">',
      '<circle cx="12" cy="5" r="1.6" fill="currentColor" />',
      '<circle cx="12" cy="12" r="1.6" fill="currentColor" />',
      '<circle cx="12" cy="19" r="1.6" fill="currentColor" />',
      '</svg>'
    ].join('');
  }

  function setTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
    syncThemeLabels(theme);
  }

  function syncThemeLabels(theme) {
    const nextMode = theme === 'dark' ? 'light' : 'dark';

    document.querySelectorAll('[data-theme-label]').forEach((el) => {
      el.textContent = `Switch to ${nextMode} mode`;
    });

    document.querySelectorAll('[data-toggle-theme]').forEach((btn) => {
      btn.setAttribute('aria-label', `Switch to ${nextMode} mode`);
      btn.setAttribute('title', `Switch to ${nextMode} mode`);
    });
  }

  function setDirection(dir) {
    const html = document.documentElement;
    html.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    syncDirectionLabels(dir);
  }

  function syncDirectionLabels(dir) {
    document.querySelectorAll('[data-dir-label]').forEach((el) => {
      el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  function initStoredPreferences() {
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem(THEME_KEY) || (systemDark ? 'dark' : 'light');
    const storedDir = localStorage.getItem(DIR_KEY) || 'ltr';
    setTheme(storedTheme);
    setDirection(storedDir);
  }

  function initThemeTransitions() {
    const html = document.documentElement;
    html.classList.add('theme-transition');
    setTimeout(() => {
      html.classList.remove('theme-transition');
    }, 500);
  }

  function enhanceHeaderThemeButtons() {
    document.querySelectorAll('header [data-toggle-theme]').forEach((btn) => {
      if (btn.dataset.iconified === 'true') {
        return;
      }

      btn.dataset.iconified = 'true';
      btn.setAttribute('type', 'button');
      btn.classList.add('site-header-icon-btn', 'site-theme-toggle');
      btn.innerHTML = getThemeToggleMarkup();

      const parent = btn.closest('li');
      if (parent) {
        parent.classList.add('site-theme-slot');
      }
    });

    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    syncThemeLabels(currentTheme);
  }

  function enhanceMenuButtons() {
    document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
      if (btn.dataset.iconified === 'true') {
        return;
      }

      btn.dataset.iconified = 'true';
      btn.setAttribute('type', 'button');
      btn.classList.add('site-header-icon-btn', 'site-mobile-menu-toggle');
      btn.innerHTML = getMenuToggleMarkup();
    });
  }

  function closeOverflowMenus() {
    document.querySelectorAll('[data-overflow-panel]').forEach((panel) => {
      panel.classList.add('hidden');
    });
    document.querySelectorAll('[data-overflow-toggle]').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  function bindOverflowMenuEvents() {
    document.querySelectorAll('[data-overflow-toggle]').forEach((btn) => {
      if (btn.dataset.bound === 'true') {
        return;
      }

      btn.dataset.bound = 'true';
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const wrapper = btn.closest('.site-overflow-wrapper');
        if (!wrapper) {
          return;
        }

        const panel = wrapper.querySelector('[data-overflow-panel]');
        if (!panel) {
          return;
        }

        const shouldOpen = panel.classList.contains('hidden');
        closeOverflowMenus();
        if (shouldOpen) {
          panel.classList.remove('hidden');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    if (document.body && document.body.dataset.overflowEventsBound === 'true') {
      return;
    }

    if (document.body) {
      document.body.dataset.overflowEventsBound = 'true';
    }

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('.site-overflow-wrapper')) {
        return;
      }
      closeOverflowMenus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeOverflowMenus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth < 1024) {
        closeOverflowMenus();
      }
    });
  }

  function enhanceDesktopHeaderOverflow() {
    document.querySelectorAll('nav#site-menu').forEach((nav) => {
      const list = nav.querySelector('ul');
      if (!list || list.dataset.overflowEnhanced === 'true') {
        return;
      }

      list.dataset.overflowEnhanced = 'true';
      nav.classList.add('site-menu-shell');
      list.classList.add('site-menu-list');

      const items = Array.from(list.children).filter((node) => node.tagName === 'LI');
      const themeItem = items.find((li) => li.querySelector('[data-toggle-theme]'));
      const overflowItems = items.filter((li) => {
        const link = li.querySelector('a[data-nav-link]');
        return link && OVERFLOW_LINKS.has(normalizeHref(link.getAttribute('href')));
      });

      if (!overflowItems.length) {
        return;
      }

      overflowItems.forEach((li) => {
        li.classList.add('site-nav-overflow-source');
      });

      const spacer = document.createElement('li');
      spacer.className = 'site-nav-spacer';
      spacer.setAttribute('aria-hidden', 'true');

      const wrapper = document.createElement('li');
      wrapper.className = 'site-overflow-wrapper';

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'site-header-icon-btn site-overflow-toggle';
      toggle.setAttribute('data-overflow-toggle', '');
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open more navigation links');
      toggle.innerHTML = getMoreMenuMarkup();

      const panel = document.createElement('div');
      panel.className = 'site-overflow-panel hidden';
      panel.setAttribute('data-overflow-panel', '');

      overflowItems.forEach((item) => {
        const source = item.querySelector('a[data-nav-link]');
        if (!source) {
          return;
        }

        const link = document.createElement('a');
        link.href = source.getAttribute('href') || '#';
        link.textContent = (source.textContent || '').trim() || 'Link';
        link.setAttribute('data-nav-link', '');
        link.className = 'site-overflow-link';
        panel.appendChild(link);
      });

      if (!panel.children.length) {
        return;
      }

      wrapper.append(toggle, panel);

      if (themeItem) {
        list.insertBefore(spacer, themeItem);
        list.insertBefore(wrapper, themeItem);
      } else {
        list.appendChild(spacer);
        list.appendChild(wrapper);
      }
    });

    bindOverflowMenuEvents();
  }

  function initToggles() {
    document.querySelectorAll('[data-toggle-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        initThemeTransitions();
        setTheme(nextTheme);
      });
    });

    document.querySelectorAll('[data-toggle-rtl]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        setDirection(current === 'rtl' ? 'ltr' : 'rtl');
        document.dispatchEvent(new CustomEvent('site:direction-changed', { detail: { dir: document.documentElement.dir } }));
      });
    });
  }

  function initMenuToggles() {
    document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('data-menu-toggle'));
        if (!target) {
          return;
        }
        closeOverflowMenus();
        target.classList.toggle('hidden');
      });
    });
  }

  function initCursorRipple() {
    const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) {
      return;
    }

    document.addEventListener('pointerdown', (e) => {
      const ripple = document.createElement('span');
      ripple.className = 'cursor-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 760);
    });
  }

  function initParallax() {
    const nodes = document.querySelectorAll('[data-parallax]');
    if (!nodes.length) {
      return;
    }

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nodes.forEach((node) => {
        const speed = Number(node.getAttribute('data-parallax')) || 0.2;
        node.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    });
  }

  function initCompass() {
    const compass = document.querySelector('[data-compass]');
    if (!compass || !window.gsap) {
      return;
    }

    gsap.to(compass, {
      rotation: 360,
      duration: 18,
      repeat: -1,
      ease: 'none'
    });
  }

  function createToastContainer() {
    let container = document.getElementById('toast-root');
    if (container) {
      return container;
    }

    container = document.createElement('div');
    container.id = 'toast-root';
    container.className = 'fixed z-[100] right-4 top-4 flex w-[90vw] max-w-sm flex-col gap-2';
    document.body.appendChild(container);
    return container;
  }

  function toast(message, type) {
    const palette = {
      success: 'border-emerald-300/70 bg-emerald-500/20 text-emerald-100',
      warning: 'border-amber-300/70 bg-amber-500/20 text-amber-100',
      error: 'border-rose-300/70 bg-rose-500/20 text-rose-100',
      info: 'border-sky-300/70 bg-sky-500/20 text-sky-100'
    };

    const container = createToastContainer();
    const card = document.createElement('div');
    card.className = `glass rounded-xl border px-4 py-3 text-sm shadow-xl ${palette[type || 'info']}`;
    card.textContent = message;
    container.appendChild(card);

    setTimeout(() => {
      card.classList.add('opacity-0', 'translate-x-2');
      setTimeout(() => card.remove(), 220);
    }, 2600);
  }

  function init() {
    initStoredPreferences();
    enhanceHeaderThemeButtons();
    enhanceMenuButtons();
    enhanceDesktopHeaderOverflow();
    initToggles();
    initMenuToggles();
    initCursorRipple();
    initParallax();
    initCompass();
  }

  window.SiteCore = {
    init,
    setTheme,
    setDirection,
    toast
  };
})();
