(function () {
  const body = document.body;
  const menu = document.querySelector('.menu-toggle');
  if (menu) {
    menu.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let active = 0;

  function showSlide(index) {
    if (!slides.length) return;
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, idx) {
      slide.classList.toggle('active', idx === active);
    });
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('active', idx === active);
    });
  }

  dots.forEach(function (dot, idx) {
    dot.addEventListener('click', function () {
      showSlide(idx);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  const globalInputs = Array.from(document.querySelectorAll('.global-search'));
  globalInputs.forEach(function (input) {
    const panel = input.parentElement.querySelector('.search-panel');
    input.addEventListener('input', function () {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        panel.hidden = true;
        panel.innerHTML = '';
        return;
      }
      const data = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];
      const result = data.filter(function (item) {
        return item.t.toLowerCase().includes(q) || item.g.toLowerCase().includes(q) || item.c.toLowerCase().includes(q);
      }).slice(0, 12);
      panel.innerHTML = result.map(function (item) {
        return '<a class="search-item" href="./' + item.u + '"><strong>' + item.t + '</strong><span>' + item.y + ' · ' + item.c + ' · ' + item.g + '</span></a>';
      }).join('');
      panel.hidden = result.length === 0;
    });
    document.addEventListener('click', function (event) {
      if (!input.parentElement.contains(event.target)) {
        panel.hidden = true;
      }
    });
  });

  const pageFilter = document.querySelector('.page-filter');
  const yearFilter = document.querySelector('.year-filter');
  const regionFilter = document.querySelector('.region-filter');
  const cards = Array.from(document.querySelectorAll('.movie-card'));

  function applyFilter() {
    const q = pageFilter ? pageFilter.value.trim().toLowerCase() : '';
    const year = yearFilter ? yearFilter.value : '';
    const region = regionFilter ? regionFilter.value : '';
    cards.forEach(function (card) {
      const title = (card.dataset.title || '').toLowerCase();
      const cardYear = card.dataset.year || '';
      const cardRegion = card.dataset.region || '';
      const match = (!q || title.includes(q)) && (!year || cardYear === year) && (!region || cardRegion === region);
      card.classList.toggle('hidden-card', !match);
    });
  }

  [pageFilter, yearFilter, regionFilter].forEach(function (control) {
    if (control) control.addEventListener('input', applyFilter);
  });
})();
