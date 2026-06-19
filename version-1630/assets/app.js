(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const thumbs = Array.from(hero.querySelectorAll('[data-hero-thumb]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function activate(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });

      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('is-active', thumbIndex === current);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        activate(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        activate(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        activate(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.dataset.heroDot || '0'));
        restart();
      });
    });

    activate(0);
    restart();
  }

  const pageFilter = document.querySelector('[data-page-filter]');
  const filterCount = document.querySelector('[data-filter-count]');

  if (pageFilter) {
    const cards = Array.from(document.querySelectorAll('[data-card]'));

    pageFilter.addEventListener('input', function () {
      const keyword = pageFilter.value.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach(function (card) {
        const haystack = [card.dataset.title, card.dataset.keywords].join(' ').toLowerCase();
        const matched = !keyword || haystack.includes(keyword);
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visibleCount += 1;
        }
      });

      if (filterCount) {
        filterCount.textContent = visibleCount + ' 部影片';
      }
    });
  }

  const searchForm = document.querySelector('[data-search-form]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  const searchSummary = document.querySelector('[data-search-summary]');

  function createCard(movie) {
    const tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="movie-card compact">' +
        '<a class="movie-poster" href="' + escapeHtml(movie.file) + '">' +
          '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
          '<span class="poster-shade"></span>' +
          '<span class="play-chip">立即观看</span>' +
        '</a>' +
        '<div class="movie-info">' +
          '<div class="movie-meta-line">' +
            '<span>' + escapeHtml(movie.year) + '</span>' +
            '<span>' + escapeHtml(movie.region) + '</span>' +
            '<span>' + escapeHtml(movie.type) + '</span>' +
          '</div>' +
          '<h3><a href="' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h3>' +
          '<p>' + escapeHtml(movie.oneLine || '') + '</p>' +
          '<div class="tag-row">' + tags + '</div>' +
        '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function runSearch(keyword) {
    if (!searchResults || !searchSummary || !Array.isArray(window.MOVIE_SEARCH_INDEX)) {
      return;
    }

    const query = keyword.trim().toLowerCase();

    if (!query) {
      searchResults.innerHTML = '';
      searchSummary.textContent = '输入关键词开始搜索。';
      return;
    }

    const results = window.MOVIE_SEARCH_INDEX.filter(function (movie) {
      return movie.searchText.toLowerCase().includes(query);
    }).slice(0, 200);

    searchSummary.textContent = '搜索 “' + keyword + '” 找到 ' + results.length + ' 个结果' + (results.length === 200 ? '，已显示前 200 个。' : '。');
    searchResults.innerHTML = results.map(createCard).join('');
  }

  if (searchForm && searchInput) {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q') || '';
    searchInput.value = initial;
    runSearch(initial);

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const keyword = searchInput.value.trim();
      const nextUrl = keyword ? 'search.html?q=' + encodeURIComponent(keyword) : 'search.html';
      window.history.replaceState(null, '', nextUrl);
      runSearch(keyword);
    });
  }
})();
