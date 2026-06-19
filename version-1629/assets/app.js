(function(){
const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-button');
const mobile=document.querySelector('.mobile-nav');
function onScroll(){if(header){header.classList.toggle('scrolled',window.scrollY>16)}}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
if(menu&&mobile){menu.addEventListener('click',()=>{const open=mobile.classList.toggle('open');menu.setAttribute('aria-expanded',open?'true':'false')})}
const slides=[...document.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('.hero-dot')];
let active=0;
function show(i){if(!slides.length)return;active=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===active));dots.forEach((d,n)=>d.classList.toggle('active',n===active))}
const prev=document.querySelector('.hero-control.prev');
const next=document.querySelector('.hero-control.next');
if(prev)prev.addEventListener('click',()=>show(active-1));
if(next)next.addEventListener('click',()=>show(active+1));
dots.forEach((d,i)=>d.addEventListener('click',()=>show(i)));
if(slides.length>1)setInterval(()=>show(active+1),5200);
const input=document.querySelector('[data-search-input]');
if(input){const cards=[...document.querySelectorAll('[data-search]')];const empty=document.querySelector('.empty-state');input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const hit=!q||card.getAttribute('data-search').toLowerCase().includes(q);card.classList.toggle('hidden-card',!hit);if(hit)shown++});if(empty)empty.style.display=shown?'none':'block'})}
})();