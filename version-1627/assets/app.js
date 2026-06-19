const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (header) {
    const updateHeader = () => {
        header.classList.toggle('scrolled', window.scrollY > 24);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
}

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const next = hero.querySelector('[data-hero-next]');
    const prev = hero.querySelector('[data-hero-prev]');
    let current = 0;
    let timer = null;

    const showSlide = (index) => {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    };

    const start = () => {
        timer = window.setInterval(() => showSlide(current + 1), 5200);
    };

    const reset = () => {
        if (timer) {
            window.clearInterval(timer);
        }
        start();
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            reset();
        });
    });

    if (next) {
        next.addEventListener('click', () => {
            showSlide(current + 1);
            reset();
        });
    }

    if (prev) {
        prev.addEventListener('click', () => {
            showSlide(current - 1);
            reset();
        });
    }

    showSlide(0);
    start();
}

const filterSection = document.querySelector('[data-filter-section]');

if (filterSection) {
    const cards = Array.from(filterSection.querySelectorAll('.movie-card'));
    const search = filterSection.querySelector('[data-card-search]');
    const yearButtons = Array.from(filterSection.querySelectorAll('[data-filter-year]'));
    let activeYear = 'all';

    const applyFilter = () => {
        const keyword = search ? search.value.trim().toLowerCase() : '';
        cards.forEach((card) => {
            const year = card.dataset.year || '';
            const haystack = [card.dataset.title, card.dataset.region, card.dataset.genre, card.dataset.tags].join(' ').toLowerCase();
            const matchesKeyword = !keyword || haystack.includes(keyword);
            const matchesYear = activeYear === 'all' || year === activeYear;
            card.classList.toggle('is-filter-hidden', !(matchesKeyword && matchesYear));
        });
    };

    if (search) {
        search.addEventListener('input', applyFilter);
    }

    yearButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeYear = button.dataset.filterYear || 'all';
            yearButtons.forEach((item) => item.classList.toggle('active', item === button));
            applyFilter();
        });
    });
}

const searchPage = document.querySelector('[data-search-page]');

if (searchPage && Array.isArray(window.MOVIES)) {
    const form = searchPage.querySelector('[data-search-form]');
    const input = searchPage.querySelector('[data-search-input]');
    const region = searchPage.querySelector('[data-search-region]');
    const year = searchPage.querySelector('[data-search-year]');
    const results = searchPage.querySelector('[data-search-results]');
    const status = searchPage.querySelector('[data-search-status]');

    const params = new URLSearchParams(window.location.search);
    const initialKeyword = params.get('keyword') || '';
    if (input && initialKeyword) {
        input.value = initialKeyword;
    }

    const escapeHtml = (value) => String(value || '').replace(/[&<>"]/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
    }[char]));

    const renderCard = (movie) => {
        const tags = (movie.tags || []).slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
        return `
<article class="movie-card">
    <a class="poster-link" href="movie/${movie.file}" aria-label="${escapeHtml(movie.title)}">
        <img src="./${movie.cover}.jpg" alt="${escapeHtml(movie.title)}" loading="lazy">
        <span class="poster-shade"></span>
        <span class="poster-year">${escapeHtml(movie.year)}</span>
    </a>
    <div class="movie-card-body">
        <div class="movie-meta-line">
            <span>${escapeHtml(movie.region)}</span>
            <span>${escapeHtml(movie.type)}</span>
        </div>
        <h3><a href="movie/${movie.file}">${escapeHtml(movie.title)}</a></h3>
        <p>${escapeHtml(movie.oneLine || movie.summary || '').slice(0, 110)}</p>
        <div class="tag-row">${tags}</div>
    </div>
</article>`;
    };

    const doSearch = () => {
        const keyword = input ? input.value.trim().toLowerCase() : '';
        const regionValue = region ? region.value.trim() : '';
        const yearValue = year ? year.value.trim() : '';
        const matched = window.MOVIES.filter((movie) => {
            const haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags.join(' '), movie.oneLine, movie.summary].join(' ').toLowerCase();
            const keywordMatch = !keyword || haystack.includes(keyword);
            const regionMatch = !regionValue || String(movie.region || '').includes(regionValue);
            const yearMatch = !yearValue || String(movie.year || '') === yearValue;
            return keywordMatch && regionMatch && yearMatch;
        }).slice(0, 120);

        if (status) {
            status.textContent = keyword || regionValue || yearValue ? `找到 ${matched.length} 个结果` : '推荐影片';
        }

        if (results) {
            results.innerHTML = matched.map(renderCard).join('');
        }
    };

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            doSearch();
        });
    }

    [input, region, year].forEach((element) => {
        if (element) {
            element.addEventListener('input', doSearch);
            element.addEventListener('change', doSearch);
        }
    });

    if (initialKeyword) {
        doSearch();
    }
}
