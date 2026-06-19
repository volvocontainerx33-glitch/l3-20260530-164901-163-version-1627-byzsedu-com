document.addEventListener("DOMContentLoaded", function () {
    var mobileButton = document.querySelector("[data-mobile-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (mobileButton && mobilePanel) {
        mobileButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var active = slides.findIndex(function (slide) {
        return slide.classList.contains("is-active");
    });

    if (active < 0) {
        active = 0;
    }

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === active);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === active);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
        });
    });

    if (prev) {
        prev.addEventListener("click", function () {
            showSlide(active - 1);
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            showSlide(active + 1);
        });
    }

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(active + 1);
        }, 5600);
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var empty = document.querySelector("[data-no-result]");
    var currentFilter = "all";

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function filterCards() {
        if (!cards.length) {
            return;
        }
        var query = normalize(inputs.map(function (input) {
            return input.value;
        }).join(" "));
        var shown = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search"));
            var matchText = !query || text.indexOf(query) !== -1;
            var matchFilter = currentFilter === "all" || text.indexOf(normalize(currentFilter)) !== -1;
            var visible = matchText && matchFilter;
            card.style.display = visible ? "" : "none";
            if (visible) {
                shown += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", shown === 0);
        }
    }

    inputs.forEach(function (input) {
        input.addEventListener("input", filterCards);
    });

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]")).forEach(function (button) {
        button.addEventListener("click", function () {
            currentFilter = button.getAttribute("data-filter-value") || "all";
            Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]")).forEach(function (item) {
                item.classList.toggle("is-active", item === button);
            });
            filterCards();
        });
    });

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");
    if (initialQuery && inputs.length) {
        inputs.forEach(function (input) {
            input.value = initialQuery;
        });
        filterCards();
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-search-form]")).forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var input = form.querySelector("input");
            var value = input ? input.value.trim() : "";
            if (cards.length && inputs.length) {
                inputs.forEach(function (target) {
                    target.value = value;
                });
                filterCards();
                return;
            }
            window.location.href = "search.html" + (value ? "?q=" + encodeURIComponent(value) : "");
        });
    });
});
