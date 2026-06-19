import{H as Hls}from"./hls-vendor-dru42stk.js";
export function initMoviePlayer(src){
const shell=document.querySelector(".player-shell");
const video=document.querySelector(".movie-video");
const layer=document.querySelector(".play-layer");
const button=document.querySelector(".play-button");
const status=document.querySelector(".play-status");
if(!shell||!video||!src)return;
let ready=false;
let hls=null;
function mark(){shell.classList.add("is-playing");if(status)status.textContent=""}
function bind(){
if(ready)return;
ready=true;
video.controls=true;
if(Hls.isSupported()){
hls=new Hls({enableWorker:true,lowLatencyMode:true});
hls.loadSource(src);
hls.attachMedia(video);
hls.on(Hls.Events.ERROR,function(e,data){if(data&&data.fatal){if(status)status.textContent="播放出错，请稍后再试"}});
}else if(video.canPlayType("application/vnd.apple.mpegurl")){
video.src=src;
}else{
if(status)status.textContent="播放出错，请稍后再试";
}
}
function start(){
bind();
const p=video.play();
if(p&&p.then)p.then(mark).catch(function(){video.controls=true});
}
if(layer)layer.addEventListener("click",start);
if(button)button.addEventListener("click",start);
video.addEventListener("click",function(){if(video.paused)start()});
video.addEventListener("playing",mark);
window.addEventListener("pagehide",function(){if(hls)hls.destroy()});
}