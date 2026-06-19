(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function bindNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function bindHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5600);
  }

  function bindFilters() {
    var input = document.getElementById("movieSearch");
    var type = document.getElementById("typeFilter");
    var year = document.getElementById("yearFilter");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-list] .movie-card"));
    var empty = document.querySelector(".empty-result");
    if (!cards.length) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    if (input && initial) {
      input.value = initial;
    }
    function apply() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var t = type ? type.value : "";
      var y = year ? year.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var text = ((card.dataset.title || "") + " " + (card.dataset.tags || "") + " " + (card.dataset.region || "") + " " + (card.dataset.type || "") + " " + (card.dataset.year || "")).toLowerCase();
        var ok = true;
        if (q && text.indexOf(q) === -1) {
          ok = false;
        }
        if (t && (card.dataset.type || "") !== t) {
          ok = false;
        }
        if (y && (card.dataset.year || "") !== y) {
          ok = false;
        }
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }
    [input, type, year].forEach(function (el) {
      if (!el) {
        return;
      }
      el.addEventListener("input", apply);
      el.addEventListener("change", apply);
    });
    apply();
  }

  function bindPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll(".video-shell"));
    shells.forEach(function (shell) {
      var video = shell.querySelector("video");
      var button = shell.querySelector(".play-layer");
      var url = shell.getAttribute("data-video-url");
      var loaded = false;
      var hlsObject = null;
      if (!video || !button || !url) {
        return;
      }
      function loadVideo() {
        if (loaded) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else if (globalThis.Hls && globalThis.Hls.isSupported()) {
          hlsObject = new globalThis.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsObject.loadSource(url);
          hlsObject.attachMedia(video);
          shell.hlsObject = hlsObject;
        } else {
          video.src = url;
        }
        loaded = true;
      }
      function play() {
        loadVideo();
        shell.classList.add("is-playing");
        var action = video.play();
        if (action && typeof action.catch === "function") {
          action.catch(function () {
            video.controls = true;
          });
        }
      }
      button.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
    });
  }

  ready(function () {
    bindNavigation();
    bindHero();
    bindFilters();
    bindPlayers();
  });
})();
