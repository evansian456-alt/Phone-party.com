/**
 * Phone Party – Interactive JavaScript
 * Clean, dependency-free, well-organized
 */

/* ============================================================
   Utilities
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ============================================================
   1. Navigation – scroll blur + active links + mobile menu
   ============================================================ */
function initNav() {
  const nav = $('.nav');
  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');

  // Scroll state
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);

    // Active link highlighting
    const sections = $$('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    $$('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close mobile menu on link click
  $$('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   2. Smooth Scroll – anchor links
   ============================================================ */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ============================================================
   3. Scroll Reveal – IntersectionObserver
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   4. Hero Animations – soundwave + floating cards
   ============================================================ */
function initHeroAnimations() {
  // Randomize wave bar animation durations for organic feel
  $$('.wave-bar').forEach(bar => {
    const dur = (0.6 + Math.random() * 0.8).toFixed(2);
    const delay = (Math.random() * 0.4).toFixed(2);
    bar.style.animationDuration = `${dur}s`;
    bar.style.animationDelay = `-${delay}s`;
  });

  // Subtle mouse parallax on floating cards
  const visualSection = $('.hero-visual');
  if (!visualSection) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    $$('.float-card').forEach((card, i) => {
      const factor = (i + 1) * 4;
      card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

/* ============================================================
   5. Interactive Demo System – 4-step state machine
   ============================================================ */
let demoState = {
  currentStep: 0,
  running: false,
  partyCode: '',
  phoneCount: 0,
  reactionCounts: { fire: 0, heart: 0, party: 0, lightning: 0 },
  totalReactions: 0
};

function initDemo() {
  const startBtn = $('#startDemoBtn');
  const mainStartBtn = $('#mainStartDemoBtn');
  const heroStartBtn = $('#heroStartDemoBtn');

  startBtn?.addEventListener('click', () => kickoffDemo());
  mainStartBtn?.addEventListener('click', () => {
    kickoffDemo();
    fireConfetti(mainStartBtn);
  });
  heroStartBtn?.addEventListener('click', () => {
    kickoffDemo();
    fireConfetti(heroStartBtn);
    // Scroll to demo
    const demoSec = $('#demo');
    if (demoSec) demoSec.scrollIntoView({ behavior: 'smooth' });
  });

  // Party code click to copy
  document.addEventListener('click', e => {
    if (e.target.closest('.party-code') && demoState.partyCode) {
      navigator.clipboard?.writeText(demoState.partyCode)
        .then(() => showToast('🎉 Party code copied!'))
        .catch(err => {
          console.warn('Clipboard write failed:', err);
          showToast('📋 Copy this code: ' + demoState.partyCode);
        });
    }
  });

  // Reaction buttons
  $$('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (demoState.currentStep < 4) {
        showToast('⚠️ Start the demo first!');
        return;
      }
      const type = btn.dataset.reaction;
      demoState.reactionCounts[type] = (demoState.reactionCounts[type] || 0) + 1;
      demoState.totalReactions++;

      // Update counter display
      const counter = btn.querySelector('.reaction-count');
      if (counter) counter.textContent = demoState.reactionCounts[type];

      // Floating emoji effect
      const emoji = btn.querySelector('.reaction-emoji')?.textContent || '🎉';
      spawnFloatingEmoji(emoji, e.clientX, e.clientY);

      // Update crowd energy
      updateCrowdEnergy();
    });
  });
}

async function kickoffDemo() {
  if (demoState.running) return;
  demoState.running = true;
  demoState.currentStep = 0;

  // Reset state
  Object.assign(demoState, {
    partyCode: '', phoneCount: 0,
    reactionCounts: { fire: 0, heart: 0, party: 0, lightning: 0 },
    totalReactions: 0
  });
  resetDemoUI();

  await step1CreateParty();
  await step2PhonesJoining();
  await step3UploadQueue();
  await step4SyncReact();

  demoState.running = false;
  showToast('🎊 Demo complete! Start your real party now!');
}

function resetDemoUI() {
  // Reset step tabs
  $$('.demo-step-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === 0);
    tab.classList.remove('completed');
  });
  // Reset panels
  $$('.demo-panel').forEach((p, i) => {
    p.classList.toggle('active', i === 0);
  });
  // Reset party code
  const codeEl = $('#partyCode');
  if (codeEl) codeEl.textContent = '----';
  // Reset phone grid
  $$('.phone-join-icon').forEach(el => el.classList.remove('visible'));
  // Reset counter
  const counterEl = $('#joinCounter');
  if (counterEl) counterEl.innerHTML = '<span>0</span>';
  // Reset upload progress
  const progFill = $('#uploadProgressFill');
  if (progFill) progFill.style.width = '0%';
  // Reset queue items
  $$('.queue-item').forEach(el => el.classList.remove('visible', 'now-playing'));
  // Reset reaction counts
  $$('.reaction-count').forEach(el => el.textContent = '0');
  $$('.reaction-btn').forEach(btn => btn.style.pointerEvents = 'none');
  // Reset energy
  const energyBar = $('#demoEnergyBar');
  const energyVal = $('#demoEnergyValue');
  if (energyBar) energyBar.style.width = '0%';
  if (energyVal) energyVal.textContent = '0%';
  // Reset now playing bar
  const npBar = $('.now-playing-bar');
  if (npBar) npBar.classList.remove('playing');
}

// Step 1: Generate party code
async function step1CreateParty() {
  activateDemoStep(0);
  demoState.currentStep = 1;

  const codeEl = $('#partyCode');
  if (!codeEl) return;

  showToast('🎵 Creating your party...');
  await sleep(600);

  // Animate code generation character by character
  const code = generatePartyCode();
  demoState.partyCode = code;
  codeEl.textContent = '';

  for (let i = 0; i < code.length; i++) {
    await sleep(60);
    codeEl.textContent += code[i];
  }

  await sleep(800);
  completeDemoStep(0);
}

// Step 2: Phones joining counter animation
async function step2PhonesJoining() {
  activateDemoStep(1);
  demoState.currentStep = 2;

  const counterEl = $('#joinCounter');
  const phoneIcons = $$('.phone-join-icon');
  const target = 12;

  showToast('📱 Phones are joining the party!');

  for (let i = 1; i <= target; i++) {
    await sleep(220);
    demoState.phoneCount = i;
    if (counterEl) counterEl.innerHTML = `<span>${i}</span>`;
    if (phoneIcons[i - 1]) phoneIcons[i - 1].classList.add('visible');
  }

  await sleep(600);
  completeDemoStep(1);
}

// Step 3: Upload track + populate queue
async function step3UploadQueue() {
  activateDemoStep(2);
  demoState.currentStep = 3;

  const progressFill = $('#uploadProgressFill');
  const queueItems = $$('.queue-item');

  showToast('🎵 Uploading tracks...');

  // Animate upload progress bar
  if (progressFill) {
    for (let p = 0; p <= 100; p += 5) {
      await sleep(50);
      progressFill.style.width = `${p}%`;
    }
  }

  await sleep(400);
  showToast('✅ Track uploaded! Building queue...');
  await sleep(300);

  // Reveal queue items one by one
  for (const item of queueItems) {
    await sleep(280);
    item.classList.add('visible');
  }

  if (queueItems[0]) queueItems[0].classList.add('now-playing');

  // Activate now playing bar
  const npBar = $('.now-playing-bar');
  if (npBar) npBar.classList.add('playing');

  await sleep(800);
  completeDemoStep(2);
}

// Step 4: Enable reactions + crowd energy
async function step4SyncReact() {
  activateDemoStep(3);
  demoState.currentStep = 4;

  showToast('🔥 All phones synced! React to the music!');

  // Enable reaction buttons
  $$('.reaction-btn').forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.animation = 'none';
    btn.style.transition = 'all 0.3s var(--transition-spring)';
    // Pulse each button in
    setTimeout(() => {
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => btn.style.transform = '', 300);
    }, Math.random() * 400);
  });

  // Auto-simulate some initial reactions for visual effect
  await sleep(800);
  const reactions = ['fire', 'heart', 'party', 'lightning'];
  for (let i = 0; i < 8; i++) {
    await sleep(300);
    const type = reactions[Math.floor(Math.random() * reactions.length)];
    demoState.reactionCounts[type] = (demoState.reactionCounts[type] || 0) + 1;
    demoState.totalReactions++;
    const btn = $(`.reaction-btn[data-reaction="${type}"]`);
    const counter = btn?.querySelector('.reaction-count');
    if (counter) counter.textContent = demoState.reactionCounts[type];
    updateCrowdEnergy();
  }

  completeDemoStep(3);
}

function activateDemoStep(index) {
  $$('.demo-step-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
  $$('.demo-panel').forEach((panel, i) => {
    panel.classList.toggle('active', i === index);
  });
}

function completeDemoStep(index) {
  const tab = $$('.demo-step-tab')[index];
  if (tab) {
    tab.classList.remove('active');
    tab.classList.add('completed');
  }
}

function updateCrowdEnergy() {
  const maxEnergy = 50;
  const percentage = Math.min(100, Math.round((demoState.totalReactions / maxEnergy) * 100));
  const energyBar = $('#demoEnergyBar');
  const energyVal = $('#demoEnergyValue');
  if (energyBar) energyBar.style.width = `${percentage}%`;
  if (energyVal) energyVal.textContent = `${percentage}%`;
}

/* ============================================================
   6. Party Code Generator
   ============================================================ */
function generatePartyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part(4)}-${part(4)}`;
}

/* ============================================================
   7. FAQ Accordion
   ============================================================ */
function initFAQ() {
  $$('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      $$('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ============================================================
   8. Pricing Cards – tilt effect on mouse move
   ============================================================ */
function initPricingTilt() {
  $$('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -8;
      const tiltY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;

      // Dynamic glow that follows cursor
      const glowX = ((x / rect.width) * 100).toFixed(1);
      const glowY = ((y / rect.height) * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(124,58,237,0.1), rgba(255,255,255,0.03) 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.background = '';
      card.style.transition = 'transform 0.3s ease, background 0.3s ease';
      setTimeout(() => card.style.transition = '', 300);
    });
  });
}

/* ============================================================
   9. Counter Animation – numbers count up on scroll into view
   ============================================================ */
function initCounters() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (isNaN(target)) return;
        animateCounter(el, target);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  $$('[data-count]').forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = target >= 1000 ? current.toLocaleString() : current;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/* ============================================================
   10. Confetti / Party Effect
   ============================================================ */
function fireConfetti(originEl) {
  const rect = originEl?.getBoundingClientRect();
  const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

  const colors = ['#7c3aed', '#a855f7', '#06b6d4', '#10b981', '#ec4899', '#f59e0b', '#ffffff'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${originX}px;
      top: ${originY}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${0.8 + Math.random() * 1.2}s;
      animation-delay: ${Math.random() * 0.3}s;
      transform: translate(${(Math.random() - 0.5) * 300}px, ${(Math.random() - 0.5) * 200}px);
    `;
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

/* ============================================================
   11. Floating Emoji on Reaction Click
   ============================================================ */
function spawnFloatingEmoji(emoji, x, y) {
  const el = document.createElement('div');
  el.className = 'floating-emoji';
  el.textContent = emoji;
  el.style.cssText = `
    left: ${x - 20}px;
    top: ${y - 20}px;
    transform: translateX(${(Math.random() - 0.5) * 40}px);
  `;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/* ============================================================
   12. Toast Notifications
   ============================================================ */
function showToast(message, duration = 3000) {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">🎵</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/* ============================================================
   13. Create Party / Join Party button handlers
   ============================================================ */
function initPartyButtons() {
  $$('[data-action="create-party"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      fireConfetti(btn);
      const code = generatePartyCode();
      showToast(`🎉 Party created! Code: ${code}`);
    });
  });

  $$('[data-action="join-party"]').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('📱 Enter a party code to join!');
    });
  });
}

/* ============================================================
   14. Feature Cards – stagger entrance
   ============================================================ */
function initFeatureCards() {
  const cards = $$('.feature-card');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = cards.indexOf(entry.target);
        entry.target.style.transitionDelay = `${(idx % 4) * 80}ms`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach(card => {
    card.classList.add('reveal');
    observer.observe(card);
  });
}

/* ============================================================
   15. Crowd Energy Meter – hero page
   ============================================================ */
function initEnergyMeter() {
  const ring = $('.energy-ring');
  if (!ring) return;
  // Animate ring on scroll into view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      let energy = 0;
      const target = 75;
      const interval = setInterval(() => {
        energy = Math.min(energy + 2, target);
        ring.style.background = `conic-gradient(
          from 0deg,
          var(--accent-primary) 0%,
          var(--accent-pink) ${energy * 0.4}%,
          var(--accent-neon) ${energy}%,
          rgba(255,255,255,0.05) ${energy}%
        )`;
        if (energy >= target) clearInterval(interval);
      }, 30);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  observer.observe(ring);
}

/* ============================================================
   16. Hero Particle Background (subtle stars)
   ============================================================ */
function initParticles() {
  const heroBg = $('.hero-bg');
  if (!heroBg) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    pointer-events: none;
  `;
  heroBg.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const resize = () => {
    W = canvas.width = heroBg.offsetWidth;
    H = canvas.height = heroBg.offsetHeight;
  };

  const init = () => {
    resize();
    particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      alpha: 0.2 + Math.random() * 0.6
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  };

  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
}

/* ============================================================
   17. Copy share link
   ============================================================ */
function initShareLink() {
  const input = $('.share-link-input');
  const btn = $('.share-link-btn');
  if (!input || !btn) return;

  btn.addEventListener('click', () => {
    const url = input.value;
    navigator.clipboard?.writeText(url)
      .then(() => {
        showToast('🔗 Referral link copied!');
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy'), 2000);
      })
      .catch(err => {
        console.warn('Clipboard write failed:', err);
        showToast('📋 Copy the link from the box above!');
      });
  });
}

/* ============================================================
   18. Demo step tabs – manual navigation
   ============================================================ */
function initDemoTabs() {
  $$('.demo-step-tab').forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (!tab.classList.contains('completed') && !tab.classList.contains('active')) return;
      activateDemoStep(index);
    });
  });
}

/* ============================================================
   Init – run everything when DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSmoothScroll();
  initScrollReveal();
  initHeroAnimations();
  initDemo();
  initDemoTabs();
  initFAQ();
  initPricingTilt();
  initCounters();
  initPartyButtons();
  initFeatureCards();
  initEnergyMeter();
  initParticles();
  initShareLink();

  // Initial toast on load (subtle)
  setTimeout(() => {
    showToast('🎵 Welcome to Phone Party!', 4000);
  }, 1500);
});
