import { H as Hls } from './hls-vendor-dru42stk.js';

const players = document.querySelectorAll('[data-player]');

players.forEach(function (frame) {
  const video = frame.querySelector('video[data-src]');
  const button = frame.querySelector('[data-play-button]');
  const status = frame.querySelector('[data-player-status]');
  let hls = null;
  let loaded = false;

  if (!video || !button) {
    return;
  }

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function loadSource() {
    if (loaded) {
      return Promise.resolve();
    }

    const source = video.dataset.src;

    if (!source) {
      setStatus('未找到播放源。');
      return Promise.reject(new Error('missing video source'));
    }

    setStatus('正在加载 HLS 播放源...');

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        loaded = true;
        setStatus('播放源加载完成。');
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setStatus('网络异常，正在重新加载播放源...');
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          setStatus('媒体解码异常，正在尝试恢复...');
          hls.recoverMediaError();
          return;
        }

        setStatus('无法播放当前视频源，请稍后重试。');
        hls.destroy();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      loaded = true;
      setStatus('浏览器原生 HLS 播放已启用。');
    } else {
      setStatus('当前浏览器不支持 HLS 播放。');
      return Promise.reject(new Error('hls is not supported'));
    }

    return Promise.resolve();
  }

  async function startPlayback() {
    try {
      await loadSource();
      button.classList.add('is-hidden');
      await video.play();
      setStatus('正在播放。');
    } catch (error) {
      button.classList.remove('is-hidden');
      setStatus('点击后未能自动播放，请再次点击或检查浏览器权限。');
    }
  }

  button.addEventListener('click', startPlayback);

  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });

  video.addEventListener('pause', function () {
    if (!video.ended) {
      setStatus('已暂停。');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
