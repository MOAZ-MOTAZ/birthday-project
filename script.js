document.addEventListener("DOMContentLoaded", function () {

  const startBtn = document.getElementById("startBtn");
  const welcome = document.getElementById("welcome");
  const cakeSection = document.getElementById("cakeSection");
  const letterSection = document.getElementById("letterSection");
  const loader = document.getElementById("loader");

// Hide loader after a short delay
setTimeout(() => {
  loader.classList.add("hidden");
}, 1500);
const musicBtn = document.getElementById("musicBtn");
const musicPlayer = document.getElementById("musicPlayer");

if (musicBtn && musicPlayer) {
  musicBtn.addEventListener("click", () => {
    musicPlayer.style.display = "block";
    musicBtn.style.display = "none";
  });
}

  const candles = document.querySelectorAll(".candle");
  const sparklesWrap = document.getElementById("sparkles");
  const confettiWrap = document.getElementById("confetti");

  let blownCount = 0;
  const letterBox = document.getElementById("letterBox");
const secret = document.getElementById("secretMessage");

if (letterBox && secret) {
  letterBox.addEventListener("click", () => {
    secret.classList.add("show");
  });
}

  // ---------- Sparkles ----------
function createSparkles(count = 24) {
  sparklesWrap.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";

    // Make ~30% of them hearts
    if (Math.random() < 0.30) {
  s.classList.add("heart");
  const tip = document.createElement("span");
  s.appendChild(tip);
}
    const size = Math.random() * 6 + 4;        // 4 - 10px
    const x = Math.random() * 100;             // vw
    const y = Math.random() * 100;             // vh
    const duration = Math.random() * 10 + 12;  // 12 - 22s

    s.style.setProperty("--s", `${size}px`);
    s.style.setProperty("--x", `${x}vw`);
    s.style.setProperty("--y", `${y}vh`);
    s.style.setProperty("--d", `${duration}s`);
    s.style.animationDelay = `${Math.random() * 8}s`;

    sparklesWrap.appendChild(s);
  }
}

  createSparkles(14);

  // ---------- Confetti ----------
  function confettiBurst(pieces = 60) {
    // Clear old pieces
    confettiWrap.innerHTML = "";

    for (let i = 0; i < pieces; i++) {
      const c = document.createElement("div");
      c.className = "confetti";

      const x = Math.random() * 100; // vw
      const rot = Math.floor(Math.random() * 360);
      const duration = Math.random() * 1.4 + 1.6; // 1.6 - 3.0s

      c.style.setProperty("--x", `${x}vw`);
      c.style.setProperty("--r", `${rot}deg`);
      c.style.setProperty("--d", `${duration}s`);

      // soft pastel random colors
      const colors = ["#ffd1e8", "#e8d4ff", "#cfefff", "#fff2c9", "#d7ffe7"];
      c.style.background = colors[Math.floor(Math.random() * colors.length)];

      confettiWrap.appendChild(c);
    }

    // Cleanup after animation
    setTimeout(() => {
      confettiWrap.innerHTML = "";
    }, 3200);
  }

  // ---------- Transitions ----------
  // Transition 1 → 2
  startBtn.addEventListener("click", () => {
    welcome.classList.remove("active");
    cakeSection.classList.add("active");
  });

  // Candles logic (2 → 3)
  candles.forEach(candle => {
    candle.addEventListener("click", () => {
      const flame = candle.querySelector(".flame");
      if (!flame) return;

      flame.remove();
      blownCount++;

      if (blownCount === candles.length) {
        confettiBurst(70);

        setTimeout(() => {
          cakeSection.classList.remove("active");
          letterSection.classList.add("active");
        }, 900);
      }
    });
  });

});