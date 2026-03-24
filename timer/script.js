(function () {
  const timerEl = document.querySelector(".timer");
  const progressEl = document.getElementById("progress");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");

  const MIN_TOTAL = 5;
  const MAX_TOTAL = 99 * 60 + 59;

  let setMinutes = 5;
  let setSeconds = 0;
  let running = false;
  let finished = false;
  let frameReq = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function totalSetMs() {
    return (setMinutes * 60 + setSeconds) * 1000;
  }

  function renderTime(ms) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    minutesEl.textContent = pad(Math.floor(totalSec / 60));
    secondsEl.textContent = pad(totalSec % 60);
  }

  function setProgress(pct) {
    progressEl.style.setProperty("--pct", pct + "%");
  }

  function updateButtons() {
    startBtn.disabled = running || (setMinutes === 0 && setSeconds === 0);
    stopBtn.disabled = !running;
  }

  function reset() {
    if (frameReq) window.cancelAnimationFrame(frameReq);
    running = false;
    finished = false;
    timerEl.classList.remove("timer--running", "timer--finished");
    renderTime(totalSetMs());
    setProgress(0);
    updateButtons();
  }

  function start() {
    if (setMinutes === 0 && setSeconds === 0) return;
    running = true;
    finished = false;
    timerEl.classList.add("timer--running");
    timerEl.classList.remove("timer--finished");
    updateButtons();

    const duration = totalSetMs();
    let startTime = null;

    function tick(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const remaining = duration - elapsed;

      if (remaining > 0) {
        renderTime(remaining);
        setProgress(((duration - remaining) / duration) * 100);
        frameReq = window.requestAnimationFrame(tick);
      } else {
        renderTime(0);
        setProgress(100);
        running = false;
        finished = true;
        timerEl.classList.remove("timer--running");
        timerEl.classList.add("timer--finished");
        updateButtons();
      }
    }

    frameReq = window.requestAnimationFrame(tick);
  }

  function stop() {
    if (frameReq) window.cancelAnimationFrame(frameReq);
    running = false;
    timerEl.classList.remove("timer--running");
    updateButtons();
  }

  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", stop);
  resetBtn.addEventListener("click", reset);

  document.querySelectorAll(".adj").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (running) return;
      const target = btn.dataset.target;
      const dir = btn.dataset.dir === "up" ? 1 : -1;
      let totalSec = setMinutes * 60 + setSeconds;

      if (target === "minutes") {
        totalSec += dir * 60;
      } else {
        totalSec += dir * 5;
      }

      totalSec = Math.max(MIN_TOTAL, Math.min(MAX_TOTAL, totalSec));
      setMinutes = Math.floor(totalSec / 60);
      setSeconds = totalSec % 60;
      finished = false;
      timerEl.classList.remove("timer--finished");
      renderTime(totalSetMs());
      setProgress(0);
      updateButtons();
    });
  });

  reset();

  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  applyTheme(mq.matches);
  mq.addEventListener("change", function (e) {
    applyTheme(e.matches);
  });
})();
