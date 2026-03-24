(function () {
  const countdownEl = document.getElementById("countdown");
  const tickerEl = document.getElementById("ticker");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const MIN_MINUTES = 1;
  const MAX_MINUTES = 99;
  const DEFAULT_MINUTES = 5;

  let totalDuration = DEFAULT_MINUTES * 60 * 1000;
  let setMinutes = DEFAULT_MINUTES;
  let running = false;
  let finished = false;
  let frameReq = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function render(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
  }

  function setTicker(pct) {
    tickerEl.style.height = pct + "%";
  }

  function reset() {
    running = false;
    finished = false;
    if (frameReq) window.cancelAnimationFrame(frameReq);
    countdownEl.classList.remove("countdown--running", "countdown--ended", "countdown--finished");
    totalDuration = setMinutes * 60 * 1000;
    render(totalDuration);
    setTicker(100);
  }

  function start() {
    running = true;
    finished = false;
    countdownEl.classList.add("countdown--running");
    countdownEl.classList.remove("countdown--ended", "countdown--finished");

    const duration = totalDuration;
    let startTime = null;

    function tick(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const remaining = duration - elapsed;

      if (remaining > 0) {
        render(remaining);
        setTicker((remaining / duration) * 100);
        frameReq = window.requestAnimationFrame(tick);
      } else {
        render(0);
        setTicker(0);
        running = false;
        finished = true;
        countdownEl.classList.remove("countdown--running");
        countdownEl.classList.add("countdown--ended", "countdown--finished");
      }
    }

    frameReq = window.requestAnimationFrame(tick);
  }

  countdownEl.addEventListener("click", function (e) {
    if (e.target.closest(".btn")) return;

    if (finished) {
      reset();
      return;
    }

    if (running) {
      reset();
    } else {
      start();
    }
  });

  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (running) return;

      const action = btn.dataset.action;
      if (action === "up" && setMinutes < MAX_MINUTES) {
        setMinutes++;
      } else if (action === "down" && setMinutes > MIN_MINUTES) {
        setMinutes--;
      }
      reset();
    });
  });

  reset();

  // Theme: match OS preference
  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  applyTheme(mq.matches);
  mq.addEventListener("change", function (e) {
    applyTheme(e.matches);
  });
})();
