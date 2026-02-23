(function () {
  const state = {
    selectedDate: null,
    tripType: 'offshore',
    guests: 2,
    duration: 6,
    addOns: new Set(),
    paymentPlan: 'deposit',
    gateway: 'stripe',
    promoCode: '',
    promoPercent: 0
  };

  const prices = {
    offshore: 1250,
    deepsea: 1850,
    sport: 1450,
    sunset: 980
  };

  const addOnPrices = {
    gourmet: 140,
    drone: 90,
    premium_gear: 120,
    transfer: 80
  };

  const promoCodes = {
    OCEAN10: 10,
    ELITE15: 15,
    CAPTAIN20: 20
  };

  const availabilityEvents = [
    { title: 'Available', start: addDays(1), color: '#22c55e' },
    { title: 'Booked', start: addDays(2), color: '#ef4444' },
    { title: 'Limited', start: addDays(3), color: '#f59e0b' },
    { title: 'Available', start: addDays(5), color: '#22c55e' },
    { title: 'Booked', start: addDays(8), color: '#ef4444' },
    { title: 'Limited', start: addDays(10), color: '#f59e0b' }
  ];

  function addDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  function formatUSD(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  }

  function initCalendar() {
    const el = document.getElementById('booking-calendar');
    if (!el || !window.FullCalendar) {
      return;
    }

    const calendar = new FullCalendar.Calendar(el, {
      initialView: 'dayGridMonth',
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: availabilityEvents,
      dateClick: (info) => {
        state.selectedDate = info.dateStr;
        openBookingModal();
        updateSummary();
      }
    });

    calendar.render();

    document.addEventListener('site:direction-changed', () => {
      const isRtl = document.documentElement.dir === 'rtl';
      calendar.setOption('direction', isRtl ? 'rtl' : 'ltr');
    });

    calendar.setOption('direction', document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr');
  }

  function getStepNodes() {
    return Array.from(document.querySelectorAll('[data-step]'));
  }

  function showStep(stepIndex) {
    getStepNodes().forEach((node, idx) => {
      if (idx === stepIndex) {
        node.classList.remove('hidden');
      } else {
        node.classList.add('hidden');
      }
    });

    document.querySelectorAll('[data-step-indicator]').forEach((dot, idx) => {
      dot.classList.toggle('bg-sky-300', idx <= stepIndex);
      dot.classList.toggle('bg-slate-300/25', idx > stepIndex);
    });

    document.getElementById('prev-step').disabled = stepIndex === 0;
    const nextBtn = document.getElementById('next-step');
    if (stepIndex === getStepNodes().length - 1) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
    }

    document.getElementById('confirm-booking').classList.toggle('hidden', stepIndex !== getStepNodes().length - 1);
    document.getElementById('booking-modal').setAttribute('data-current-step', String(stepIndex));
  }

  function openBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('hidden');
    showStep(0);
    if (window.SiteCore) {
      SiteCore.toast(`Selected date: ${state.selectedDate}`, 'info');
    }
  }

  function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
  }

  function subtotal() {
    const base = prices[state.tripType] || prices.offshore;
    const guestExtra = Math.max(0, state.guests - 2) * 95;
    const durationMultiplier = state.duration / 6;
    return (base + guestExtra) * durationMultiplier;
  }

  function addOnTotal() {
    let total = 0;
    state.addOns.forEach((key) => {
      total += addOnPrices[key] || 0;
    });
    return total;
  }

  function fullTotal() {
    const raw = subtotal() + addOnTotal();
    const discount = raw * (state.promoPercent / 100);
    return Math.max(0, raw - discount);
  }

  function dueNow() {
    const total = fullTotal();
    return state.paymentPlan === 'deposit' ? total * 0.3 : total;
  }

  function updateSummary() {
    const summaryDateNodes = document.querySelectorAll('#summary-date, #selected-date-display');
    summaryDateNodes.forEach((node) => {
      node.textContent = state.selectedDate || 'Not selected';
    });

    document.getElementById('summary-trip').textContent = state.tripType;
    document.getElementById('summary-guests').textContent = String(state.guests);
    document.getElementById('summary-duration').textContent = `${state.duration} hrs`;
    document.getElementById('summary-addons').textContent = state.addOns.size ? Array.from(state.addOns).join(', ') : 'None';
    document.getElementById('summary-subtotal').textContent = formatUSD(subtotal());
    document.getElementById('summary-addons-price').textContent = formatUSD(addOnTotal());
    document.getElementById('summary-discount').textContent = `-${formatUSD((subtotal() + addOnTotal()) * (state.promoPercent / 100))}`;
    document.getElementById('summary-total').textContent = formatUSD(fullTotal());
    document.getElementById('summary-due').textContent = formatUSD(dueNow());
  }

  function initFormBindings() {
    const modal = document.getElementById('booking-modal');
    if (!modal) {
      return;
    }

    document.getElementById('open-booking-modal').addEventListener('click', openBookingModal);
    document.querySelectorAll('[data-close-booking]').forEach((btn) => btn.addEventListener('click', closeBookingModal));

    document.getElementById('trip-type').addEventListener('change', (e) => {
      state.tripType = e.target.value;
      updateSummary();
    });

    document.getElementById('guest-count').addEventListener('input', (e) => {
      state.guests = Number(e.target.value) || 2;
      updateSummary();
    });

    document.getElementById('trip-duration').addEventListener('input', (e) => {
      state.duration = Number(e.target.value) || 6;
      updateSummary();
    });

    document.querySelectorAll('[data-addon]').forEach((box) => {
      box.addEventListener('change', (e) => {
        const key = e.target.value;
        if (e.target.checked) {
          state.addOns.add(key);
        } else {
          state.addOns.delete(key);
        }
        updateSummary();
      });
    });

    document.querySelectorAll('input[name="payment-plan"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        state.paymentPlan = e.target.value;
        updateSummary();
      });
    });

    document.querySelectorAll('input[name="gateway"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        state.gateway = e.target.value;
        renderGateway();
      });
    });

    document.getElementById('apply-promo').addEventListener('click', () => {
      const code = document.getElementById('promo-code').value.trim().toUpperCase();
      if (!code) {
        state.promoCode = '';
        state.promoPercent = 0;
        updateSummary();
        if (window.SiteCore) {
          SiteCore.toast('Promo cleared.', 'info');
        }
        return;
      }

      if (promoCodes[code]) {
        state.promoCode = code;
        state.promoPercent = promoCodes[code];
        updateSummary();
        if (window.SiteCore) {
          SiteCore.toast(`Promo ${code} applied (${state.promoPercent}% off).`, 'success');
        }
      } else if (window.SiteCore) {
        SiteCore.toast('Promo code invalid.', 'warning');
      }
    });

    document.getElementById('next-step').addEventListener('click', () => {
      const current = Number(modal.getAttribute('data-current-step') || '0');
      showStep(Math.min(current + 1, getStepNodes().length - 1));
      updateSummary();
    });

    document.getElementById('prev-step').addEventListener('click', () => {
      const current = Number(modal.getAttribute('data-current-step') || '0');
      showStep(Math.max(current - 1, 0));
    });

    document.getElementById('confirm-booking').addEventListener('click', () => {
      if (!state.selectedDate) {
        if (window.SiteCore) {
          SiteCore.toast('Pick a date from the calendar first.', 'warning');
        }
        return;
      }
      if (state.gateway === 'stripe') {
        triggerStripeCheckout();
      } else {
        if (window.SiteCore) {
          SiteCore.toast('Use PayPal button below to complete payment.', 'info');
        }
      }
    });
  }

  function triggerStripeCheckout() {
    if (!window.Stripe) {
      if (window.SiteCore) {
        SiteCore.toast('Stripe SDK unavailable. Please try again.', 'error');
      }
      return;
    }

    const fakeSessionId = 'cs_test_demo_session';
    if (window.SiteCore) {
      SiteCore.toast(`Secure Stripe session created (${fakeSessionId}).`, 'success');
      setTimeout(() => SiteCore.toast('Demo mode: connect backend webhook + session endpoint for live charges.', 'info'), 500);
    }
  }

  function renderGateway() {
    const stripePanel = document.getElementById('stripe-panel');
    const paypalPanel = document.getElementById('paypal-panel');
    const stripeSelected = state.gateway === 'stripe';

    stripePanel.classList.toggle('hidden', !stripeSelected);
    paypalPanel.classList.toggle('hidden', stripeSelected);

    if (!stripeSelected) {
      mountPayPal();
    }
  }

  let paypalMounted = false;

  function mountPayPal() {
    if (paypalMounted || !window.paypal) {
      return;
    }

    const target = document.getElementById('paypal-button-container');
    if (!target) {
      return;
    }

    paypal.Buttons({
      style: {
        shape: 'pill',
        color: 'gold',
        label: 'pay'
      },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: dueNow().toFixed(2)
              },
              description: `Luxury Charter ${state.selectedDate || ''}`
            }
          ]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function () {
          if (window.SiteCore) {
            SiteCore.toast('PayPal payment approved. Booking confirmed.', 'success');
          }
          closeBookingModal();
        });
      },
      onError: function () {
        if (window.SiteCore) {
          SiteCore.toast('PayPal checkout error. Try again.', 'error');
        }
      }
    }).render('#paypal-button-container');

    paypalMounted = true;
  }

  function init() {
    initCalendar();
    initFormBindings();
    updateSummary();
    renderGateway();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

