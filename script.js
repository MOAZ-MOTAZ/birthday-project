// PERF: DOMContentLoaded not needed — script has `defer` in HTML,
// so it always runs after the DOM is ready.

// ── Elements ──
const startBtn      = document.getElementById("startBtn");
const welcome       = document.getElementById("welcome");
const cakeSection   = document.getElementById("cakeSection");
const letterSection = document.getElementById("letterSection");
const loader        = document.getElementById("loader");
const musicBtn      = document.getElementById("musicBtn");
const musicPlayer   = document.getElementById("musicPlayer");
const spotifyFrame  = document.getElementById("spotifyFrame");
const sparklesWrap  = document.getElementById("sparkles");
const confettiWrap  = document.getElementById("confetti");
const blowBtn       = document.getElementById("blowBtn");

const SPOTIFY_SRC   = "https://open.spotify.com/embed/track/3Fzlg5r1IjhLk2qRw667od?utm_source=generator";

let blownCount = 0;
const candles  = document.querySelectorAll(".candle");

// ── Loader ──
// 900ms is enough to feel intentional without dragging
setTimeout(() => loader.classList.add("hidden"), 900);

// ── Music toggle (lazy Spotify load) ──
// PERF: iframe src is blank in HTML — only injected here on first click
// so the Spotify network request never fires on page load.
if (musicBtn && musicPlayer && spotifyFrame) {
  musicBtn.addEventListener("click", () => {
    // Inject src only once
    if (!spotifyFrame.src || spotifyFrame.src === window.location.href) {
      spotifyFrame.src = SPOTIFY_SRC;
    }
    musicPlayer.style.display    = "block";
    musicBtn.style.opacity       = "0";
    musicBtn.style.pointerEvents = "none";
    setTimeout(() => { musicBtn.style.display = "none"; }, 400);
  }, { once: true }); // PERF: listener auto-removes after first click
}

// ── Sparkles — created ONCE, never rebuilt ──
// PERF: original code called innerHTML="" + rebuilt all nodes on every
// section enter. Now we create them once and leave CSS animations running.
(function createSparkles(count) {
  const frag = document.createDocumentFragment(); // PERF: single reflow

  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";

    if (Math.random() < 0.30) {
      s.classList.add("heart");
      s.appendChild(document.createElement("span"));
    }

    const size     = Math.random() * 8 + 4;
    const x        = Math.random() * 100;
    const y        = Math.random() * 100;
    const duration = Math.random() * 12 + 14;

    s.style.setProperty("--s", `${size}px`);
    s.style.setProperty("--x", `${x}vw`);
    s.style.setProperty("--y", `${y}vh`);
    s.style.setProperty("--d", `${duration}s`);
    s.style.animationDelay = `${Math.random() * 10}s`;

    frag.appendChild(s);
  }

  sparklesWrap.appendChild(frag); // PERF: one DOM insertion for all nodes
})(18);

// ── Confetti burst ──
function confettiBurst(pieces) {
  const colors = [
    "#ffc6e0", "#e8b4f8", "#bde8ff",
    "#fff5c2", "#c8f9e2", "#ffd6c0"
  ];

  const frag = document.createDocumentFragment(); // PERF: batch insertion

  for (let i = 0; i < pieces; i++) {
    const c = document.createElement("div");
    c.className = "confetti";

    const x        = Math.random() * 100;
    const rot      = Math.floor(Math.random() * 360);
    const duration = Math.random() * 1.8 + 1.6;

    c.style.setProperty("--x", `${x}vw`);
    c.style.setProperty("--r", `${rot}deg`);
    c.style.setProperty("--d", `${duration}s`);
    c.style.background     = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = `${Math.random() * 0.4}s`;

    if (Math.random() < 0.3) {
      c.style.borderRadius = "50%";
      c.style.width = c.style.height = "9px";
    }

    frag.appendChild(c);
  }

  confettiWrap.appendChild(frag); // PERF: one insertion
  setTimeout(() => { confettiWrap.innerHTML = ""; }, 3800);
}

// ── Local sparkle burst on candle blow ──
// PERF: replaced requestAnimationFrame loop (which was never cancelled)
// with a single rAF + CSS transition — no lingering loops.
function sparkle(el) {
  const rect = el.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top;

  for (let i = 0; i < 6; i++) {
    const dot = document.createElement("div");
    dot.style.cssText = `
      position:fixed;
      width:6px;height:6px;
      border-radius:50%;
      background:hsl(${Math.random() * 60 + 330},90%,70%);
      left:${cx}px;
      top:${cy}px;
      pointer-events:none;
      z-index:9999;
      transition:transform 0.6s ease,opacity 0.6s ease;
      opacity:1;
    `;
    document.body.appendChild(dot);

    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * 60 + 30;

    // PERF: single rAF — no loop. The transition does the work.
    requestAnimationFrame(() => {
      dot.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 40}px)`;
      dot.style.opacity   = "0";
    });

    // PERF: guaranteed removal — no orphaned nodes
    setTimeout(() => dot.remove(), 700);
  }
}

// ── Transition helper ──
function goToLetter() {
  confettiBurst(80);
  setTimeout(() => {
    cakeSection.classList.remove("active");
    letterSection.classList.add("active"); // simultaneous crossfade
  }, 600); // was 900 — feels snappier
}

// ── Section transitions ──
// Welcome → Cake
startBtn.addEventListener("click", () => {
  welcome.classList.remove("active");
  cakeSection.classList.add("active"); // simultaneous — CSS transition handles the crossfade
});

// ── Individual candle click ──
candles.forEach(candle => {
  candle.addEventListener("click", () => {
    const flame = candle.querySelector(".flame");
    if (!flame) return; // already blown

    flame.style.transition = "transform 0.2s ease, opacity 0.25s ease";
    flame.style.transform  = "translateX(-50%) scale(1.5)";
    flame.style.opacity    = "0";
    setTimeout(() => flame.remove(), 260);

    sparkle(candle);
    blownCount++;

    if (blownCount === candles.length) {
      // Disable blow button too (all gone)
      if (blowBtn) blowBtn.disabled = true;
      goToLetter();
    }
  });
});

// ── Blow-all button ──
// Staggers candle extinguish 110ms apart left → right,
// then triggers confetti + letter transition automatically.
if (blowBtn) {
  blowBtn.addEventListener("click", () => {
    blowBtn.disabled = true;

    candles.forEach((candle, i) => {
      setTimeout(() => {
        const flame = candle.querySelector(".flame");
        if (!flame) return; // already manually blown

        flame.style.transition = "transform 0.15s ease, opacity 0.2s ease";
        flame.style.transform  = "translateX(-50%) scale(2) translateY(-6px)";
        flame.style.opacity    = "0";
        setTimeout(() => flame.remove(), 220);

        sparkle(candle);
        blownCount++;

        if (blownCount === candles.length) {
          goToLetter();
        }
      }, i * 110);
    });
  });
}
