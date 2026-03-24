(function () {
  var timer = document.getElementById("timer");
  var clockEl = document.getElementById("clock");
  var fill = document.getElementById("progressFill");
  var startBtn = document.getElementById("startBtn");
  var stopBtn = document.getElementById("stopBtn");
  var resetBtn = document.getElementById("resetBtn");
  var upBtn = document.getElementById("up");
  var downBtn = document.getElementById("down");

  var minutes = 5;
  var running = false;
  var done = false;
  var raf = null;
  var frozenMs = null;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function display(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    clockEl.textContent = pad(Math.floor(s / 60)) + ":" + pad(s % 60);
  }

  function bar(pct) {
    fill.style.width = Math.min(100, Math.max(0, pct)) + "%";
  }

  function show(el) { el.classList.remove("hidden"); }
  function hide(el) { el.classList.add("hidden"); }

  function toIdle() {
    running = false;
    done = false;
    frozenMs = null;
    timer.className = "timer";
    display(minutes * 60000);
    bar(0);
    show(startBtn);
    hide(stopBtn);
  }

  function startTimer() {
    var total = minutes * 60000;
    var duration = frozenMs != null ? frozenMs : total;
    frozenMs = null;
    running = true;
    done = false;
    timer.className = "timer ticking";
    hide(startBtn);
    show(stopBtn);

    var t0 = null;

    function tick(now) {
      if (!t0) t0 = now;
      var left = duration - (now - t0);
      if (left > 0) {
        display(left);
        bar(((total - left) / total) * 100);
        raf = requestAnimationFrame(tick);
      } else {
        display(0);
        bar(100);
        running = false;
        done = true;
        timer.className = "timer done";
        show(startBtn);
        hide(stopBtn);
      }
    }

    raf = requestAnimationFrame(tick);
  }

  function stopTimer() {
    if (raf) cancelAnimationFrame(raf);
    running = false;
    timer.className = "timer";

    var parts = clockEl.textContent.split(":");
    frozenMs = (parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)) * 1000;

    show(startBtn);
    hide(stopBtn);
  }

  function resetTimer() {
    if (raf) cancelAnimationFrame(raf);
    toIdle();
  }

  startBtn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); startTimer(); });
  stopBtn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); stopTimer(); });
  resetBtn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); resetTimer(); });

  upBtn.addEventListener("click", function (e) {
    e.preventDefault(); e.stopPropagation();
    if (running) return;
    if (minutes < 99) minutes++;
    frozenMs = null; done = false;
    timer.classList.remove("done");
    display(minutes * 60000);
    bar(0);
  });

  downBtn.addEventListener("click", function (e) {
    e.preventDefault(); e.stopPropagation();
    if (running) return;
    if (minutes > 1) minutes--;
    frozenMs = null; done = false;
    timer.classList.remove("done");
    display(minutes * 60000);
    bar(0);
  });

  toIdle();

  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  function theme(dark) { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); }
  theme(mq.matches);
  mq.addEventListener("change", function (e) { theme(e.matches); });
})();
