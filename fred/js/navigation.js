(()=>{
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const body=document.body;

// Theme initialization based on page
const darkPages=['about','community','resources'];
function initTheme(){
const path=location.pathname;
let theme='light';
darkPages.forEach(p=>{if(path.includes(p))theme='dark'});
document.documentElement.setAttribute('data-theme',theme);
body.setAttribute('data-theme',theme);
}
initTheme();

const nav=$('#nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',pageYOffset>50),{passive:!0});

const burger=$('#burger'),menu=$('#mobileMenu');
burger.addEventListener('click',()=>{
const open=burger.classList.contains('open');
burger.classList.toggle('open');
burger.setAttribute('aria-expanded',!open);
menu.classList.toggle('open');
body.classList.toggle('modal-open',!open);
});

$$('.mobile-link,.mobile-donate').forEach(l=>l.addEventListener('click',()=>{
burger.classList.remove('open');
burger.setAttribute('aria-expanded','false');
menu.classList.remove('open');
body.classList.remove('modal-open');
}));

function setActive(){
const path=location.pathname;
$$('.nav-link,.mobile-link').forEach(l=>{
l.classList.remove('active');
l.removeAttribute('aria-current');
const href=l.getAttribute('href');
if(href===path||(path==='/'&&href==='/')){
l.classList.add('active');
l.setAttribute('aria-current','page');
}
});
}

addEventListener('DOMContentLoaded',()=>{setActive();initTheme()});
addEventListener('popstate',()=>{setActive();initTheme()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))burger.click()});
})();
