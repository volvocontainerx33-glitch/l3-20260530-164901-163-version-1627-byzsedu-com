(function () {
  function startPlayer(box) {
    const video = box.querySelector('video');
    const layer = box.querySelector('.play-layer');
    const stream = box.getAttribute('data-stream');
    if (!video || !stream) return;

    function playNow() {
      if (layer) layer.classList.add('is-hidden');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.src) video.src = stream;
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!video.hlsReady) {
          const hls = new window.Hls();
          hls.loadSource(stream);
          hls.attachMedia(video);
          video.hlsReady = true;
        }
        video.play().catch(function () {});
        return;
      }
      if (!video.src) video.src = stream;
      video.play().catch(function () {});
    }

    if (layer) layer.addEventListener('click', playNow);
    video.addEventListener('click', function () {
      if (video.paused) playNow();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.player-box').forEach(startPlayer);
  });
})();
