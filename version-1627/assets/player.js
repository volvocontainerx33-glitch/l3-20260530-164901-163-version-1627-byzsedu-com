const player = document.querySelector('.movie-player');
const playButton = document.querySelector('[data-play-button]');
const message = document.querySelector('[data-player-message]');
let hlsInstance = null;
let sourceLoaded = false;

const setMessage = (value) => {
    if (message) {
        message.textContent = value || '';
    }
};

const loadSource = () => {
    if (!player || sourceLoaded) {
        return Promise.resolve();
    }

    const source = player.dataset.source;

    if (!source) {
        setMessage('播放源暂时无法加载');
        return Promise.resolve();
    }

    sourceLoaded = true;

    if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(player);
        hlsInstance.on(window.Hls.Events.ERROR, (event, data) => {
            if (!data || !data.fatal) {
                return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                setMessage('网络连接异常，正在重新加载');
                hlsInstance.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                setMessage('媒体加载异常，正在恢复播放');
                hlsInstance.recoverMediaError();
            } else {
                setMessage('播放源暂时无法加载');
                hlsInstance.destroy();
            }
        });
        return Promise.resolve();
    }

    if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = source;
        return Promise.resolve();
    }

    setMessage('当前浏览器无法播放该影片');
    return Promise.resolve();
};

const beginPlay = () => {
    loadSource().then(() => {
        if (!player) {
            return;
        }
        const playPromise = player.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(() => {
                if (playButton) {
                    playButton.classList.add('is-hidden');
                }
                setMessage('');
            }).catch(() => {
                setMessage('点击播放器即可继续播放');
            });
        }
    });
};

if (playButton) {
    playButton.addEventListener('click', beginPlay);
}

if (player) {
    player.addEventListener('click', () => {
        if (player.paused) {
            beginPlay();
        }
    });
    player.addEventListener('play', () => {
        if (playButton) {
            playButton.classList.add('is-hidden');
        }
    });
    player.addEventListener('pause', () => {
        if (playButton && !player.ended) {
            playButton.classList.remove('is-hidden');
        }
    });
}

window.addEventListener('pagehide', () => {
    if (hlsInstance) {
        hlsInstance.destroy();
    }
});
