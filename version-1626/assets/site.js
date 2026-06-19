(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function setActiveSlide(hero, nextIndex) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return 0;
        }
        var index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
        });
        return index;
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var index = 0;
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var timer;

        function go(value) {
            index = setActiveSlide(hero, value);
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                go(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                go(i);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                go(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                go(index + 1);
                restart();
            });
        }

        restart();
    }

    function setupNav() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupSearchAndFilters() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));
        forms.forEach(function (form) {
            var scope = form.closest("main") || document;
            var input = form.querySelector("[data-search-input]") || form.querySelector("input[type='search']");
            var items = Array.prototype.slice.call(scope.querySelectorAll(".movie-item"));

            function runSearch() {
                var query = normalize(input ? input.value : "");
                items.forEach(function (item) {
                    var text = normalize([
                        item.getAttribute("data-title"),
                        item.getAttribute("data-region"),
                        item.getAttribute("data-type"),
                        item.getAttribute("data-year"),
                        item.getAttribute("data-genre"),
                        item.getAttribute("data-tags"),
                        item.textContent
                    ].join(" "));
                    item.classList.toggle("is-hidden", query && text.indexOf(query) === -1);
                });
            }

            form.addEventListener("submit", function (event) {
                event.preventDefault();
                runSearch();
            });

            if (input) {
                input.addEventListener("input", runSearch);
                var params = new URLSearchParams(window.location.search);
                var query = params.get("q");
                if (query) {
                    input.value = query;
                    runSearch();
                }
            }
        });

        var groups = Array.prototype.slice.call(document.querySelectorAll("[data-filter-buttons]"));
        groups.forEach(function (group) {
            var scope = group.closest("section") || document;
            var items = Array.prototype.slice.call(scope.querySelectorAll(".movie-item"));
            var buttons = Array.prototype.slice.call(group.querySelectorAll("[data-filter-type]"));
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    var type = button.getAttribute("data-filter-type");
                    buttons.forEach(function (btn) {
                        btn.classList.toggle("active", btn === button);
                    });
                    items.forEach(function (item) {
                        var itemType = item.getAttribute("data-type") || "";
                        item.classList.toggle("is-hidden", type !== "all" && itemType !== type);
                    });
                });
            });
        });
    }

    window.initMoviePlayer = function (source, poster) {
        ready(function () {
            var video = document.getElementById("movie-video");
            var start = document.getElementById("player-start");
            if (!video || !source) {
                return;
            }
            if (poster) {
                video.setAttribute("poster", poster);
            }

            function bindSource() {
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    if (video.getAttribute("src") !== source) {
                        video.setAttribute("src", source);
                    }
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    if (!video._hlsInstance) {
                        var hls = new window.Hls({
                            enableWorker: true,
                            lowLatencyMode: true,
                            backBufferLength: 90
                        });
                        hls.loadSource(source);
                        hls.attachMedia(video);
                        video._hlsInstance = hls;
                    }
                    return;
                }
                if (video.getAttribute("src") !== source) {
                    video.setAttribute("src", source);
                }
            }

            function startPlay() {
                bindSource();
                if (start) {
                    start.classList.add("is-hidden");
                }
                var playResult = video.play();
                if (playResult && typeof playResult.catch === "function") {
                    playResult.catch(function () {
                        if (start) {
                            start.classList.remove("is-hidden");
                        }
                    });
                }
            }

            if (start) {
                start.addEventListener("click", startPlay);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlay();
                }
            });
            video.addEventListener("play", function () {
                if (start) {
                    start.classList.add("is-hidden");
                }
            });
        });
    };

    ready(function () {
        setupNav();
        setupHero();
        setupSearchAndFilters();
    });
})();
