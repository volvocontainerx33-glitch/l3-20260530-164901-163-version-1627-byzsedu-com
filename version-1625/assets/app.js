(function () {
    var body = document.body;
    var menuToggle = document.querySelector('[data-menu-toggle]');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            body.classList.toggle('menu-open');
        });
    }

    document.querySelectorAll('[data-mobile-menu] a').forEach(function (link) {
        link.addEventListener('click', function () {
            body.classList.remove('menu-open');
        });
    });

    document.querySelectorAll('[data-search-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
        var activeCategory = 'all';
        var chips = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-category]'));

        function normalize(value) {
            return (value || '').toString().trim().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : '');

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' '));
                var cardCategory = card.getAttribute('data-category') || '';
                var matchText = !keyword || haystack.indexOf(keyword) !== -1;
                var matchCategory = activeCategory === 'all' || cardCategory === activeCategory;
                card.classList.toggle('is-hidden', !(matchText && matchCategory));
            });
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                activeCategory = chip.getAttribute('data-filter-category') || 'all';
                chips.forEach(function (item) {
                    item.classList.toggle('active', item === chip);
                });
                applyFilter();
            });
        });
    });

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });

        setInterval(function () {
            showSlide(index + 1);
        }, 5200);
    }
})();
