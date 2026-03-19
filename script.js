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
  const siteHeader = $('.site-header');
  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');

  // Scroll state
  const onScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 20);

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
   5. Interactive Demo System – 7-step YouTube Party flow
   ============================================================ */
let demoState = {
  currentStep: 0,
  running: false,
  partyCode: '',
  phoneCount: 0,
  reactionCounts: { fire: 0, heart: 0, party: 0, lightning: 0 },
  totalReactions: 0
};

// Update the caption bar below the step tabs
function setDemoCaption(icon, text) {
  const iconEl = $('#demoCaptionIcon');
  const textEl = $('#demoCaptionText');
  if (iconEl) iconEl.textContent = icon;
  if (textEl) textEl.textContent = text;
}

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
      // Clipboard API requires HTTPS or localhost; fall back to a visible prompt
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(demoState.partyCode)
          .then(() => showToast('🎉 Party code copied!'))
          .catch(err => {
            console.warn('Clipboard write failed:', err);
            showToast('📋 Copy this code: ' + demoState.partyCode);
          });
      } else {
        showToast('📋 Your code: ' + demoState.partyCode);
      }
    }
  });

  // Reaction buttons (enabled from step 6 onwards)
  $$('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (demoState.currentStep < 6) {
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

  await stepSearchYouTube();
  await stepPickVideo();
  await stepStartParty();
  await stepFriendsJoin();
  await stepStayInSync();
  await stepReactChat();
  await stepUpNext();

  demoState.running = false;
  setDemoCaption('🎊', 'Demo complete! Start your real party now.');
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
  // Reset search input & results
  const searchInput = $('#ytSearchInput');
  if (searchInput) searchInput.value = '';
  $$('.yt-result-item').forEach(el => {
    el.classList.remove('visible', 'selected');
  });
  // Reset party code
  const codeEl = $('#partyCode');
  if (codeEl) codeEl.textContent = '----';
  // Reset phone grid
  $$('.phone-join-icon').forEach(el => el.classList.remove('visible'));
  // Reset counter
  const counterEl = $('#joinCounter');
  if (counterEl) counterEl.innerHTML = '<span>0</span>';
  // Reset npSyncCount
  const npSync = $('#npSyncCount');
  if (npSync) npSync.textContent = '0';
  // Reset sync phone timestamps and progress
  $$('.ps-timestamp').forEach(el => { el.textContent = '0:00'; });
  $$('.ps-progress-fill').forEach(el => { el.style.width = '0%'; });
  // Reset chat area
  const chatArea = $('#chatArea');
  if (chatArea) chatArea.innerHTML = '';
  // Reset queue items
  $$('.queue-item').forEach(el => el.classList.remove('visible'));
  // Reset reaction counts
  $$('.reaction-count').forEach(el => el.textContent = '0');
  $$('.reaction-btn').forEach(btn => btn.style.pointerEvents = 'none');
  // Reset now playing bar
  const npBar = $('.now-playing-bar');
  if (npBar) npBar.classList.remove('playing');
  // Reset caption
  setDemoCaption('▶', 'Click "Play Demo" to begin the walkthrough');
}

// Step 1: Search YouTube – type a query, reveal results
async function stepSearchYouTube() {
  activateDemoStep(0);
  demoState.currentStep = 1;
  setDemoCaption('🔍', 'Search YouTube — paste a link or type any artist, song, or playlist');

  const searchInput = $('#ytSearchInput');
  await sleep(500);

  const query = 'party mix 2024';
  if (searchInput) {
    searchInput.placeholder = '';
    for (const char of query) {
      await sleep(90);
      searchInput.value += char;
    }
  }

  // Simulate a brief "searching..." pause
  await sleep(900);

  // Reveal search results one by one with a comfortable pace
  const results = $$('.yt-result-item');
  for (const item of results) {
    await sleep(320);
    item.classList.add('visible');
  }

  // Give the user time to read the results
  await sleep(1800);
  completeDemoStep(0);
}

// Step 2: Pick a video – highlight the first result
async function stepPickVideo() {
  activateDemoStep(1);
  demoState.currentStep = 2;
  setDemoCaption('🎬', 'Pick a video — tap any result to add it to the party queue');

  await sleep(800);

  // Highlight first search result briefly before switching panel
  const firstResult = $('.yt-result-item');
  if (firstResult) firstResult.classList.add('selected');

  // Keep the selected state visible long enough for the user to see
  await sleep(1600);
  completeDemoStep(1);
}

// Step 3: Start the party – generate party code
async function stepStartParty() {
  activateDemoStep(2);
  demoState.currentStep = 3;
  setDemoCaption('🎉', 'Start the party — one tap creates a shareable code for your friends');

  const codeEl = $('#partyCode');
  await sleep(800);

  if (codeEl) {
    const code = generatePartyCode();
    demoState.partyCode = code;
    codeEl.textContent = '';

    for (const char of code) {
      await sleep(80);
      codeEl.textContent += char;
    }
  }

  // Activate now playing bar
  const npBar = $('.now-playing-bar');
  if (npBar) npBar.classList.add('playing');

  // Pause so the user can read the party code and status info
  await sleep(2000);
  completeDemoStep(2);
}

// Step 4: Friends join – phone icons pop in
async function stepFriendsJoin() {
  activateDemoStep(3);
  demoState.currentStep = 4;
  setDemoCaption('📱', 'Friends join instantly — they open the app and enter your code');

  const counterEl = $('#joinCounter');
  const phoneIcons = $$('.phone-join-icon');
  const npSync = $('#npSyncCount');
  const target = 10;

  for (let i = 1; i <= target; i++) {
    await sleep(320);
    demoState.phoneCount = i;
    if (counterEl) counterEl.innerHTML = `<span>${i}</span>`;
    if (phoneIcons[i - 1]) phoneIcons[i - 1].classList.add('visible');
    if (npSync) npSync.textContent = String(i);
  }

  // Pause so the user can appreciate the full room of devices
  await sleep(1400);
  completeDemoStep(3);
}

// Step 5: Stay in sync – animate timestamps together
async function stepStayInSync() {
  activateDemoStep(4);
  demoState.currentStep = 5;
  setDemoCaption('🔄', 'Stay perfectly in sync — every phone plays the exact same moment');

  await sleep(600);

  const timestamps = $$('.ps-timestamp');
  const fills = $$('.ps-progress-fill');

  // Show playback progressing through a few key moments so the user can
  // clearly see all three phones are locked to the same timestamp.
  const keyframes = [
    { secs: 8,  pct: 13 },
    { secs: 22, pct: 37 },
    { secs: 45, pct: 75 },
  ];

  for (const frame of keyframes) {
    const mins = Math.floor(frame.secs / 60);
    const secs = frame.secs % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    timestamps.forEach(el => { el.textContent = timeStr; });
    fills.forEach(el => { el.style.width = `${frame.pct}%`; });

    // Let the CSS transition (0.6 s) play out, then hold for readability
    await sleep(1600);
  }

  await sleep(800);
  completeDemoStep(4);
}

// Step 6: React & Chat – enable reactions + show chat bubbles
async function stepReactChat() {
  activateDemoStep(5);
  demoState.currentStep = 6;
  setDemoCaption('💬', 'React and chat — send reactions and messages everyone sees in real time');

  // Enable reaction buttons with a subtle pulse
  $$('.reaction-btn').forEach(btn => {
    btn.style.pointerEvents = 'auto';
    setTimeout(() => {
      btn.classList.add('reaction-btn--pulse');
      setTimeout(() => { btn.classList.remove('reaction-btn--pulse'); }, 300);
    }, Math.random() * 350);
  });

  await sleep(700);

  // Simulate chat messages appearing at a comfortable reading pace
  const messages = [
    { user: 'A', text: 'this song is 🔥🔥🔥', side: 'left' },
    { user: 'M', text: 'EVERYONE VIBE!!', side: 'left' },
    { user: 'S', text: 'Best party ever! 🎉', side: 'right' },
    { user: 'K', text: 'Turn it up!! ⚡', side: 'left' },
    { user: 'J', text: 'love this track ❤️', side: 'right' }
  ];

  const chatArea = $('#chatArea');
  const reactions = ['fire', 'heart', 'party', 'lightning'];

  for (const msg of messages) {
    await sleep(900);

    if (chatArea) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble chat-bubble--${msg.side}`;
      bubble.innerHTML = `
        <div class="chat-avatar chat-avatar--${msg.user.toLowerCase()}">${msg.user}</div>
        <div class="chat-msg">${msg.text}</div>`;
      chatArea.appendChild(bubble);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => bubble.classList.add('visible'));
      });
    }

    // Simultaneously simulate a reaction
    const type = reactions[Math.floor(Math.random() * reactions.length)];
    demoState.reactionCounts[type] = (demoState.reactionCounts[type] || 0) + 1;
    demoState.totalReactions++;
    const reactionBtn = $(`.reaction-btn[data-reaction="${type}"]`);
    const counter = reactionBtn?.querySelector('.reaction-count');
    if (counter) counter.textContent = demoState.reactionCounts[type];
  }

  await sleep(1200);
  completeDemoStep(5);
}

// Step 7: Up Next queue – reveal items one by one
async function stepUpNext() {
  activateDemoStep(6);
  demoState.currentStep = 7;
  setDemoCaption('📋', 'Keep the party going — queue the next track and the music never stops');

  await sleep(600);

  const queueItems = $$('.queue-item');
  for (const item of queueItems) {
    await sleep(500);
    item.classList.add('visible');
  }

  await sleep(1200);
  completeDemoStep(6);
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
  // Excludes visually similar characters (I, O, 1, 0) to prevent misreading
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
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
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
    // Clipboard API requires HTTPS or localhost; fall back for non-secure contexts
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url)
        .then(() => {
          showToast('🔗 Referral link copied!');
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = 'Copy'), 2000);
        })
        .catch(err => {
          console.warn('Clipboard write failed:', err);
          showToast('📋 Copy the link from the box above!');
        });
    } else {
      showToast('📋 Copy the link from the box above!');
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy'), 2000);
    }
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
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

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
