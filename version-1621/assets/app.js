(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".mobile-toggle");
        var nav = document.querySelector(".mobile-nav");

        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        document.querySelectorAll(".filter-scope").forEach(function (scope) {
            var input = scope.querySelector(".movie-search");
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

            if (!input || !cards.length) {
                return;
            }

            input.addEventListener("input", function () {
                var keyword = input.value.trim().toLowerCase();

                cards.forEach(function (card) {
                    var text = [card.dataset.title || "", card.dataset.tags || "", card.textContent || ""].join(" ").toLowerCase();
                    card.classList.toggle("is-hidden", keyword && text.indexOf(keyword) === -1);
                });
            });
        });
    });
})();
