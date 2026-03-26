document.addEventListener("DOMContentLoaded", function () {

  // ── Elements ──
  const startBtn      = document.getElementById("startBtn");
  const welcome       = document.getElementById("welcome");
  const cakeSection   = document.getElementById("cakeSection");
  const letterSection = document.getElementById("letterSection");
  const loader        = document.getElementById("loader");
  const musicBtn      = document.getElementById("musicBtn");
  const musicPlayer   = document.getElementById("musicPlayer");
  const sparklesWrap  = document.getElementById("sparkles");
  const confettiWrap  = document.getElementById("confetti");

  let blownCount = 0;

  // ── Loader ──
  setTimeout(() => loader.classList.add("hidden"), 1600);

  // ── Music toggle ──
  if (musicBtn && musicPlayer) {
    musicBtn.addEventListener("click", () => {
      musicPlayer.style.display = "block";
      musicBtn.style.opacity    = "0";
      musicBtn.style.pointerEvents = "none";
      setTimeout(() => { musicBtn.style.display = "none"; }, 400);
    });
  }

  // ── Sparkles ──
  function createSparkles(count = 20) {
    sparklesWrap.innerHTML = "";

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

      sparklesWrap.appendChild(s);
    }
  }

  createSparkles(18);

  // ── Confetti burst ──
  function confettiBurst(pieces = 70) {
    confettiWrap.innerHTML = "";

    const colors = [
      "#ffc6e0", "#e8b4f8", "#bde8ff",
      "#fff5c2", "#c8f9e2", "#ffd6c0"
    ];

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

      // Some confetti as circles
      if (Math.random() < 0.3) {
        c.style.borderRadius = "50%";
        c.style.width = c.style.height = "9px";
      }

      confettiWrap.appendChild(c);
    }

    setTimeout(() => { confettiWrap.innerHTML = ""; }, 3800);
  }

  // ── Section transitions ──
  // Welcome → Cake
  startBtn.addEventListener("click", () => {
    welcome.classList.remove("active");

    // Small delay for smooth out-animation
    setTimeout(() => {
      cakeSection.classList.add("active");
    }, 200);
  });

  // Cake (candles) → Letter
  const candles = document.querySelectorAll(".candle");

  candles.forEach(candle => {
    candle.addEventListener("click", () => {
      const flame = candle.querySelector(".flame");
      if (!flame) return;

      // Puff-out animation
      flame.style.transition = "transform 0.2s ease, opacity 0.25s ease";
      flame.style.transform  = "translateX(-50%) scale(1.5)";
      flame.style.opacity    = "0";

      setTimeout(() => flame.remove(), 260);
      blownCount++;

      // Mini sparkle at click position
      sparkle(candle);

      if (blownCount === candles.length) {
        confettiBurst(80);

        setTimeout(() => {
          cakeSection.classList.remove("active");
          setTimeout(() => {
            letterSection.classList.add("active");
          }, 200);
        }, 900);
      }
    });
  });

  // Small local sparkle when a candle is blown
  function sparkle(el) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const dot = document.createElement("div");
      dot.style.cssText = `
        position: fixed;
        width: 6px; height: 6px;
        border-radius: 50%;
        background: hsl(${Math.random() * 60 + 330}, 90%, 70%);
        left: ${rect.left + rect.width / 2}px;
        top:  ${rect.top}px;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.6s ease, opacity 0.6s ease;
        opacity: 1;
      `;
      document.body.appendChild(dot);

      const angle  = Math.random() * Math.PI * 2;
      const dist   = Math.random() * 60 + 30;
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 40}px)`;
        dot.style.opacity   = "0";
      });

      setTimeout(() => dot.remove(), 700);
    }
  }

});
