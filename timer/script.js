(function () {
  var timerEl = document.querySelector(".timer");
  var barFill = document.getElementById("progress");
  var timeEl = document.getElementById("time");
  var startBtn = document.getElementById("startBtn");
  var stopBtn = document.getElementById("stopBtn");
  var resetBtn = document.getElementById("resetBtn");
  var minUpBtn = document.getElementById("minUp");
  var minDownBtn = document.getElementById("minDown");

  var setMinutes = 5;
  var running = false;
  var finished = false;
  var frameReq = null;
  var remainingOnStop = null;

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function formatMs(ms) {
    var sec = Math.max(0, Math.ceil(ms / 1000));
    return pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);
  }

  function showTime(ms) {
    timeEl.textContent = formatMs(ms);
  }

  function setBar(pct) {
    barFill.style.width = pct + "%";
  }

  function syncUI() {
    if (running) {
      startBtn.hidden = true;
      stopBtn.hidden = false;
      timerEl.classList.add("timer--running");
    } else {
      startBtn.hidden = false;
      stopBtn.hidden = true;
      timerEl.classList.remove("timer--running");
    }
  }

  function reset() {
    if (frameReq) window.cancelAnimationFrame(frameReq);
    running = false;
    finished = false;
    remainingOnStop = null;
    timerEl.classList.remove("timer--running", "timer--finished");
    showTime(setMinutes * 60 * 1000);
    setBar(0);
    syncUI();
  }

  function start() {
    if (setMinutes <= 0 && !remainingOnStop) return;
    running = true;
    finished = false;
    timerEl.classList.remove("timer--finished");
    syncUI();

    var duration = remainingOnStop || setMinutes * 60 * 1000;
    remainingOnStop = null;
    var startedAt = null;

    function tick(now) {
      if (!startedAt) startedAt = now;
      var elapsed = now - startedAt;
      var left = duration - elapsed;

      if (left > 0) {
        showTime(left);
        setBar(((duration - left) / (setMinutes * 60 * 1000)) * 100);
        frameReq = window.requestAnimationFrame(tick);
      } else {
        showTime(0);
        setBar(100);
        running = false;
        finished = true;
        timerEl.classList.remove("timer--running");
        timerEl.classList.add("timer--finished");
        syncUI();
      }
    }

    frameReq = window.requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    if (frameReq) window.cancelAnimationFrame(frameReq);

    var displayed = timeEl.textContent.split(":");
    var m = parseInt(displayed[0], 10);
    var s = parseInt(displayed[1], 10);
    remainingOnStop = (m * 60 + s) * 1000;

    running = false;
    timerEl.classList.remove("timer--running");
    syncUI();
  }

  startBtn.addEventListener("click", function (e) {
    e.preventDefault();
    start();
  });

  stopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    stop();
  });

  resetBtn.addEventListener("click", function (e) {
    e.preventDefault();
    reset();
  });

  minUpBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (running) return;
    if (setMinutes < 99) setMinutes++;
    remainingOnStop = null;
    finished = false;
    timerEl.classList.remove("timer--finished");
    showTime(setMinutes * 60 * 1000);
    setBar(0);
  });

  minDownBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (running) return;
    if (setMinutes > 1) setMinutes--;
    remainingOnStop = null;
    finished = false;
    timerEl.classList.remove("timer--finished");
    showTime(setMinutes * 60 * 1000);
    setBar(0);
  });

  reset();

  // Auto-match OS light/dark theme
  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  applyTheme(mq.matches);
  mq.addEventListener("change", function (e) {
    applyTheme(e.matches);
  });
})();
