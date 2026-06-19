import { H as Hls } from "./hls-player.js";

const selectAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function initMobileMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
        return;
    }

    toggle.addEventListener("click", () => {
        panel.classList.toggle("is-open");
    });
}

function initGlobalSearch() {
    selectAll("[data-global-search]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = form.querySelector("input[name='q']");
            const query = input ? input.value.trim() : "";
            const target = query ? `./search.html?q=${encodeURIComponent(query)}` : "./search.html";
            window.location.href = target;
        });
    });
}

function initHeroCarousel() {
    const carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
        return;
    }

    const slides = selectAll("[data-hero-slide]", carousel);
    const dots = selectAll("[data-hero-dot]", carousel);
    if (!slides.length) {
        return;
    }

    let index = 0;
    let timer = null;

    const setActive = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });
    };

    dots.forEach((dot, dotIndex) => {
        dot.addEventListener("click", () => {
            setActive(dotIndex);
            window.clearInterval(timer);
            timer = window.setInterval(() => setActive(index + 1), 5200);
        });
    });

    setActive(0);
    timer = window.setInterval(() => setActive(index + 1), 5200);
}

function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
}

function initFilters() {
    const scopes = selectAll("[data-filter-scope]");
    scopes.forEach((scope) => {
        const input = scope.querySelector("[data-page-search]");
        const chips = selectAll("[data-filter]", scope);
        const sort = scope.querySelector("[data-sort]");
        const cards = selectAll("[data-card]", scope);
        let activeType = "all";

        const apply = () => {
            const query = normalize(input ? input.value : "");
            cards.forEach((card) => {
                const haystack = normalize(card.dataset.search);
                const type = normalize(card.dataset.type);
                const typeMatch = activeType === "all" || type.includes(activeType);
                const queryMatch = !query || haystack.includes(query);
                card.classList.toggle("hidden-card", !(typeMatch && queryMatch));
            });
        };

        const applySort = () => {
            if (!sort) {
                return;
            }
            const mode = sort.value;
            const parent = cards[0] ? cards[0].parentElement : null;
            if (!parent) {
                return;
            }
            const ordered = [...cards].sort((a, b) => {
                if (mode === "year") {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                }
                if (mode === "title") {
                    return (a.dataset.title || "").localeCompare(b.dataset.title || "", "zh-Hans-CN");
                }
                return Number(b.dataset.rank || 0) - Number(a.dataset.rank || 0);
            });
            ordered.forEach((card) => parent.appendChild(card));
        };

        if (input) {
            const params = new URLSearchParams(window.location.search);
            const query = params.get("q");
            if (query && !input.value) {
                input.value = query;
            }
            input.addEventListener("input", apply);
        }

        chips.forEach((chip) => {
            chip.addEventListener("click", () => {
                activeType = normalize(chip.dataset.filter || "all");
                chips.forEach((item) => item.classList.remove("is-active"));
                chip.classList.add("is-active");
                apply();
            });
        });

        if (sort) {
            sort.addEventListener("change", () => {
                applySort();
                apply();
            });
            applySort();
        }

        apply();
    });
}

function initPlayers() {
    selectAll("[data-player]").forEach((player) => {
        const video = player.querySelector("video");
        const button = player.querySelector("[data-play]");
        const source = video ? video.dataset.src : "";
        let hasStarted = false;

        const start = () => {
            if (!video || !source) {
                return;
            }

            if (!hasStarted) {
                hasStarted = true;
                player.classList.add("is-playing");

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    video.play().catch(() => {});
                    return;
                }

                if (Hls && Hls.isSupported()) {
                    const hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        video.play().catch(() => {});
                    });
                    video.hlsInstance = hls;
                    return;
                }

                video.src = source;
            }

            video.play().catch(() => {});
        };

        if (button) {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                start();
            });
        }

        player.addEventListener("click", (event) => {
            if (event.target === video) {
                return;
            }
            start();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initGlobalSearch();
    initHeroCarousel();
    initFilters();
    initPlayers();
});
