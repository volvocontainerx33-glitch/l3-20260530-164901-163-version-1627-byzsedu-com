(function () {
    window.mountMoviePlayer = function (videoId, sourceUrl) {
        var video = document.getElementById(videoId);

        if (!video || !sourceUrl) {
            return;
        }

        var shell = video.closest(".player-shell");
        var overlay = shell ? shell.querySelector(".player-overlay") : null;
        var hls = null;
        var loaded = false;

        function load() {
            if (loaded) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
            } else {
                video.src = sourceUrl;
            }

            loaded = true;
        }

        function start() {
            load();

            if (shell) {
                shell.classList.add("is-playing");
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", start);
        }

        video.addEventListener("play", function () {
            if (shell) {
                shell.classList.add("is-playing");
            }
        });

        video.addEventListener("loadedmetadata", function () {
            if (video.paused && shell) {
                shell.classList.remove("is-playing");
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
