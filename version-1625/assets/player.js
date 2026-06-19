function initMoviePlayer(source, videoId) {
    var video = document.getElementById(videoId);

    if (!video) {
        return;
    }

    var frame = video.closest('.player-frame');
    var cover = frame ? frame.querySelector('.player-cover') : null;
    var hlsInstance = null;
    var loaded = false;

    function loadSource() {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = source;
    }

    function beginPlayback() {
        loadSource();

        if (cover) {
            cover.classList.add('is-hidden');
        }

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (cover) {
        cover.addEventListener('click', beginPlayback);
    }

    video.addEventListener('click', function () {
        if (!loaded) {
            beginPlayback();
        }
    });

    video.addEventListener('play', function () {
        if (cover) {
            cover.classList.add('is-hidden');
        }
    });

    video.addEventListener('emptied', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
        loaded = false;
    });
}
