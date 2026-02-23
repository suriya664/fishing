(function () {
  const ROLE_KEY = 'fcb_role';
  let role = localStorage.getItem(ROLE_KEY) || 'captain';
  let availabilityCalendar;

  const stats = {
    captain: {
      upcoming: 14,
      totalBookings: 124,
      monthlyPrimary: '$32,400',
      monthlyLabel: 'Monthly Earnings',
      completed: 286,
      rating: '4.9'
    },
    customer: {
      upcoming: 3,
      totalBookings: 12,
      monthlyPrimary: '2,860',
      monthlyLabel: 'Loyalty Points',
      completed: 9,
      rating: '4.8'
    }
  };

  function initRoleToggle() {
    document.querySelectorAll('[data-role-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        role = btn.getAttribute('data-role-toggle');
        localStorage.setItem(ROLE_KEY, role);
        renderRole();
        if (window.SiteCore) {
          SiteCore.toast(`Switched to ${role} view.`, 'success');
        }
      });
    });

    renderRole();
  }

  function renderRole() {
    document.querySelectorAll('[data-role-only]').forEach((node) => {
      const targetRole = node.getAttribute('data-role-only');
      node.classList.toggle('hidden', targetRole !== role);
    });

    document.querySelectorAll('[data-role-toggle]').forEach((btn) => {
      const active = btn.getAttribute('data-role-toggle') === role;
      btn.classList.toggle('bg-sky-400/30', active);
      btn.classList.toggle('border-sky-300/50', active);
      btn.classList.toggle('bg-slate-900/30', !active);
      btn.classList.toggle('border-slate-700/50', !active);
    });

    const selected = stats[role];
    document.getElementById('stat-upcoming').textContent = selected.upcoming;
    document.getElementById('stat-total-bookings').textContent = selected.totalBookings;
    document.getElementById('stat-primary-label').textContent = selected.monthlyLabel;
    document.getElementById('stat-primary').textContent = selected.monthlyPrimary;
    document.getElementById('stat-completed').textContent = selected.completed;
    document.getElementById('stat-rating').textContent = selected.rating;
  }

  function initSidebar() {
    const drawer = document.getElementById('dashboard-sidebar');
    const openBtn = document.getElementById('sidebar-open');
    const closeBtn = document.getElementById('sidebar-close');

    if (!drawer || !openBtn || !closeBtn) {
      return;
    }

    const hiddenClassForDir = () => (document.documentElement.dir === 'rtl' ? 'translate-x-full' : '-translate-x-full');

    const closeDrawer = () => {
      drawer.classList.remove('-translate-x-full', 'translate-x-full');
      drawer.classList.add(hiddenClassForDir());
    };

    const openDrawer = () => {
      drawer.classList.remove('-translate-x-full', 'translate-x-full');
    };

    if (window.innerWidth < 1024) {
      closeDrawer();
    } else {
      openDrawer();
    }

    openBtn.addEventListener('click', () => {
      openDrawer();
    });

    closeBtn.addEventListener('click', () => {
      closeDrawer();
    });

    document.querySelectorAll('[data-nav-target]').forEach((link) => {
      link.addEventListener('click', () => {
        const id = link.getAttribute('data-nav-target');
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (window.innerWidth < 1024) {
          closeDrawer();
        }
      });
    });

    document.addEventListener('site:direction-changed', () => {
      if (window.innerWidth < 1024 && (drawer.classList.contains('-translate-x-full') || drawer.classList.contains('translate-x-full'))) {
        closeDrawer();
      }
    });
  }

  function dateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function initAvailabilityCalendar() {
    const el = document.getElementById('availability-calendar');
    if (!el || !window.FullCalendar) {
      return;
    }

    const events = [
      { title: 'Available', start: dateOffset(1), color: '#22c55e' },
      { title: 'Booked', start: dateOffset(2), color: '#ef4444' },
      { title: 'Limited', start: dateOffset(4), color: '#f59e0b' },
      { title: 'Booked', start: dateOffset(8), color: '#ef4444' },
      { title: 'Available', start: dateOffset(11), color: '#22c55e' }
    ];

    availabilityCalendar = new FullCalendar.Calendar(el, {
      initialView: 'dayGridMonth',
      height: 'auto',
      direction: document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events,
      dateClick: (info) => openAvailabilityEditor(info.dateStr)
    });

    availabilityCalendar.render();

    document.addEventListener('site:direction-changed', () => {
      availabilityCalendar.setOption('direction', document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr');
    });
  }

  function openAvailabilityEditor(dateStr) {
    const panel = document.getElementById('availability-editor');
    if (!panel) {
      return;
    }

    document.getElementById('availability-date').textContent = dateStr;
    document.getElementById('availability-date-input').value = dateStr;
    panel.classList.remove('hidden');
  }

  function initAvailabilityEditor() {
    const panel = document.getElementById('availability-editor');
    if (!panel) {
      return;
    }

    document.getElementById('close-availability-editor').addEventListener('click', () => {
      panel.classList.add('hidden');
    });

    document.getElementById('save-availability').addEventListener('click', () => {
      if (!availabilityCalendar) {
        return;
      }

      const date = document.getElementById('availability-date-input').value;
      const status = document.getElementById('availability-status').value;
      const hours = document.getElementById('availability-hours').value;
      const price = document.getElementById('availability-price').value;
      const blocked = document.getElementById('availability-blocked').checked;

      const colorMap = {
        available: '#22c55e',
        booked: '#ef4444',
        limited: '#f59e0b'
      };

      const finalStatus = blocked ? 'booked' : status;

      availabilityCalendar.addEvent({
        title: `${finalStatus.charAt(0).toUpperCase() + finalStatus.slice(1)} - ${hours} - $${price}`,
        start: date,
        color: colorMap[finalStatus]
      });

      panel.classList.add('hidden');
      if (window.SiteCore) {
        SiteCore.toast('Availability updated.', 'success');
      }
    });
  }

  function initCharts() {
    if (!window.Chart) {
      return;
    }

    const chartDefaults = {
      borderColor: 'rgba(148, 163, 184, 0.2)',
      color: '#cbd5e1'
    };

    const revenueCtx = document.getElementById('chart-revenue');
    if (revenueCtx) {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'Revenue',
              data: [18, 22, 26, 24, 31, 29, 34],
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              fill: true,
              tension: 0.42
            }
          ]
        },
        options: {
          animation: { duration: 1100, easing: 'easeOutQuart' },
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: chartDefaults },
            y: { grid: chartDefaults }
          }
        }
      });
    }

    const bookingCtx = document.getElementById('chart-bookings');
    if (bookingCtx) {
      new Chart(bookingCtx, {
        type: 'bar',
        data: {
          labels: ['Coastal', 'Deep Sea', 'Sport', 'Sunset'],
          datasets: [
            {
              label: 'Bookings',
              data: [19, 34, 27, 16],
              backgroundColor: ['#22c55e', '#38bdf8', '#f59e0b', '#a78bfa']
            }
          ]
        },
        options: {
          animation: { duration: 900, easing: 'easeOutBack' },
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: chartDefaults },
            y: { grid: chartDefaults }
          }
        }
      });
    }

    const popCtx = document.getElementById('chart-popularity');
    if (popCtx) {
      new Chart(popCtx, {
        type: 'doughnut',
        data: {
          labels: ['Tuna Run', 'Marlin Hunt', 'Family Cruise', 'Night Casting'],
          datasets: [
            {
              data: [31, 24, 28, 17],
              backgroundColor: ['#06b6d4', '#f59e0b', '#22c55e', '#ef4444']
            }
          ]
        },
        options: {
          animation: { duration: 1200 },
          plugins: {
            legend: {
              labels: {
                color: '#cbd5e1'
              }
            }
          }
        }
      });
    }

    const occCtx = document.getElementById('chart-occupancy');
    if (occCtx) {
      new Chart(occCtx, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Occupancy %',
              data: [72, 88, 81, 90],
              backgroundColor: '#0ea5e9'
            }
          ]
        },
        options: {
          indexAxis: 'y',
          animation: { duration: 900 },
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: chartDefaults, max: 100 },
            y: { grid: chartDefaults }
          }
        }
      });
    }
  }

  function initTripActions() {
    document.querySelectorAll('[data-trip-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-trip-action');
        const label = btn.getAttribute('data-trip-label') || 'trip';
        const msgMap = {
          accept: `${label} accepted.`,
          reject: `${label} rejected.`,
          message: `Message thread opened for ${label}.`,
          complete: `${label} marked as completed.`,
          invoice: `Invoice download started for ${label}.`,
          review: `Review modal opened for ${label}.`,
          details: `Loading details for ${label}.`,
          cancel: `${label} cancellation requested.`,
          reschedule: `${label} reschedule flow opened.`
        };

        if (window.SiteCore) {
          SiteCore.toast(msgMap[action] || 'Action processed.', 'info');
        }
      });
    });
  }

  function initProfileSettings() {
    const avatarInput = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');

    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener('change', () => {
        const file = avatarInput.files && avatarInput.files[0];
        if (!file) {
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          avatarPreview.src = reader.result;
          if (window.SiteCore) {
            SiteCore.toast('Avatar updated locally.', 'success');
          }
        };
        reader.readAsDataURL(file);
      });
    }

    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.SiteCore) {
          SiteCore.toast('Password change request submitted securely.', 'success');
        }
      });
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (window.SiteCore) {
          SiteCore.toast('Logging out...', 'info');
        }
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 800);
      });
    }
  }

  function initDashboard() {
    initRoleToggle();
    initSidebar();
    initAvailabilityCalendar();
    initAvailabilityEditor();
    initCharts();
    initTripActions();
    initProfileSettings();
  }

  document.addEventListener('DOMContentLoaded', initDashboard);
})();


