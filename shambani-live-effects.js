/**
 * ShambaNi Live Effects - Drop-in JavaScript for dynamic marketplace feel
 * Add: <script src="shambani-live-effects.js"></script> before </body>
 * Zero dependencies. Works on any static HTML page.
 */

(function () {
  'use strict';

  // ===== STYLES =====
  const style = document.createElement('style');
  style.textContent = `
    .sn-live-bar { display:flex; align-items:center; justify-content:center; gap:12px; padding:6px 16px; font-size:11px; color:#5a5a5a; background:#f8faf6; border-bottom:1px solid #e8e8e0; flex-wrap:wrap; }
    .sn-live-bar span { display:flex; align-items:center; gap:3px; }
    .sn-live-dot { width:6px; height:6px; border-radius:50%; background:#22C55E; animation:snPulse 2s infinite; }
    @keyframes snPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .sn-flash-sale { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-radius:12px; background:linear-gradient(135deg,#DC2626,#B91C1C); color:#fff; margin:8px 0; }
    .sn-flash-sale .sn-timer { display:flex; gap:4px; }
    .sn-flash-sale .sn-timer-box { background:rgba(255,255,255,0.15); padding:3px 6px; border-radius:6px; font-weight:700; font-size:14px; min-width:28px; text-align:center; }
    .sn-viewing-badge { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:500; color:#1A6B3C; background:rgba(26,107,60,0.08); }
    .sn-viewing-dot { width:5px; height:5px; border-radius:50%; background:#22C55E; animation:snPulse 2s infinite; }
    .sn-sold-badge { display:inline-flex; align-items:center; gap:3px; font-size:10px; color:#888; }
    .sn-stock-urgent { display:inline-flex; align-items:center; gap:2px; padding:2px 7px; border-radius:20px; font-size:9px; font-weight:700; }
    .sn-stock-low { background:#DC2626; color:#fff; animation:snPulse 1.5s infinite; }
    .sn-stock-med { background:#FEF3C7; color:#B45309; }
    .sn-toast-container { position:fixed; bottom:16px; right:16px; z-index:9999; display:flex; flex-direction:column; gap:8px; max-width:320px; }
    .sn-toast { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px; background:#fff; box-shadow:0 4px 20px rgba(0,0,0,0.15); border-left:4px solid #1A6B3C; animation:snSlideIn 0.4s ease; font-size:13px; color:#333; }
    .sn-toast-icon { font-size:18px; flex-shrink:0; }
    @keyframes snSlideIn { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes snFadeOut { from{opacity:1} to{opacity:0;transform:translateX(120%)} }
  `;
  document.head.appendChild(style);

  // ===== LIVE VIEWER COUNTER =====
  const liveVisitors = {
    count: Math.floor(Math.random() * 6) + 3,
    viewers: new Set(),
    init() {
      this.render();
      setInterval(() => {
        this.count += Math.random() > 0.5 ? 1 : -1;
        this.count = Math.max(2, Math.min(12, this.count));
        this.render();
      }, 15000 + Math.random() * 15000);
    },
    render() {
      document.querySelectorAll('.sn-live-count').forEach(el => {
        el.textContent = this.count + (el.dataset.suffix || ' viewing');
      });
    }
  };

  // ===== FAKE SALES TOASTS =====
  const fakeSales = [
    { name:'Nakamya Grace', action:'sold', item:'5kg of fresh tomatoes', loc:'Kampala' },
    { name:'Mugerwa Peter', action:'sold', item:'2 trays of organic eggs', loc:'Jinja' },
    { name:'Auma Sarah', action:'bought', item:'10kg of Matooke', loc:'Mbarara' },
    { name:'Kato Robert', action:'sold', item:'1 bunch of sweet bananas', loc:'Mpigi' },
    { name:'Nantume Alice', action:'sold', item:'3kg of groundnuts', loc:'Masaka' },
    { name:'Ochieng John', action:'bought', item:'20kg of Irish potatoes', loc:'Kabale' },
    { name:'Uwimana Jean', action:'sold', item:'1kg of Rwandan coffee', loc:'Gisenyi' },
    { name:'Kamau Peter', action:'sold', item:'15 broiler chickens', loc:'Nairobi' },
    { name:'Mbaruku Hassan', action:'sold', item:'8 fresh pineapples', loc:'Arusha' },
    { name:'Namusoke Grace', action:'bought', item:'50kg of maize flour', loc:'Wakiso' },
    { name:'Twinomujuni Paul', action:'sold', item:'10kg of carrots', loc:'Fort Portal' },
    { name:'Chebet Faith', action:'sold', item:'5kg of premium tea', loc:'Kericho' },
  ];

  const toasts = {
    container: null,
    index: 0,
    init() {
      this.container = document.createElement('div');
      this.container.className = 'sn-toast-container';
      document.body.appendChild(this.container);
      setTimeout(() => this.show(), 15000); // First toast after 15s
    },
    show() {
      const sale = fakeSales[this.index % fakeSales.length];
      const toast = document.createElement('div');
      toast.className = 'sn-toast';
      toast.innerHTML = `<span class="sn-toast-icon">🛒</span><span><strong>${sale.name}</strong> ${sale.action} ${sale.item} in ${sale.loc}!</span>`;
      this.container.appendChild(toast);
      this.index++;
      
      setTimeout(() => {
        toast.style.animation = 'snFadeOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
      }, 5000);

      const nextDelay = 40000 + Math.random() * 80000; // 40s - 2min
      setTimeout(() => this.show(), nextDelay);
    }
  };

  // ===== COUNTDOWN TIMER =====
  const countdown = {
    init() {
      const boxes = document.querySelectorAll('.sn-countdown-box');
      if (!boxes.length) return;
      const update = () => {
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const diff = end - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const vals = [h, m, s];
        boxes.forEach((box, i) => {
          if (vals[i] !== undefined) box.textContent = String(vals[i]).padStart(2, '0');
        });
      };
      update();
      setInterval(update, 1000);
    }
  };

  // ===== FARMER COUNTER (localStorage) =====
  const farmerCounter = {
    init() {
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem('sn_farmers_visit');
      let count = parseInt(localStorage.getItem('sn_farmers_count') || '487');
      
      if (lastVisit !== today) {
        count += Math.floor(Math.random() * 3) + 1;
        localStorage.setItem('sn_farmers_count', String(count));
        localStorage.setItem('sn_farmers_visit', today);
      }
      
      document.querySelectorAll('.sn-farmers-count').forEach(el => {
        el.textContent = count + '+';
      });
    }
  };

  // ===== SOCIAL PROOF BAR =====
  const socialProof = {
    init() {
      const existingBar = document.querySelector('.sn-live-bar');
      if (existingBar) return; // Already on page
      
      const bar = document.createElement('div');
      bar.className = 'sn-live-bar';
      bar.innerHTML = `
        <span><span class="sn-live-dot"></span> <span class="sn-live-count" data-suffix=" online">${liveVisitors.count} online</span></span>
        <span>|</span>
        <span>👨‍🌾 <span class="sn-farmers-count">487+</span> farmers this week</span>
        <span>|</span>
        <span>📦 50+ orders today</span>
      `;
      
      const header = document.querySelector('header');
      if (header) header.after(bar);
    }
  };

  // ===== STOCK URGENCY =====
  const stockUrgency = {
    init() {
      document.querySelectorAll('.sn-stock-check').forEach(el => {
        const stock = Math.floor(Math.random() * 8) + 1;
        const badge = document.createElement('span');
        if (stock <= 3) {
          badge.className = 'sn-stock-urgent sn-stock-low';
          badge.innerHTML = `⚡ Only ${stock} left!`;
        } else if (stock <= 5) {
          badge.className = 'sn-stock-urgent sn-stock-med';
          badge.textContent = `${stock} left`;
        }
        if (badge.className) el.appendChild(badge);
      });
    }
  };

  // ===== SOLD TODAY =====
  const soldToday = {
    init() {
      document.querySelectorAll('.sn-sold-today').forEach(el => {
        const sold = (parseInt(el.dataset.base) || 5) + Math.floor(Math.random() * 15);
        el.innerHTML = `📈 ${sold} sold today`;
      });
    }
  };

  // ===== INITIALIZE ALL =====
  function init() {
    liveVisitors.init();
    toasts.init();
    countdown.init();
    farmerCounter.init();
    socialProof.init();
    stockUrgency.init();
    soldToday.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual control
  window.ShambaNiLive = { liveVisitors, toasts, countdown, farmerCounter };

})();
