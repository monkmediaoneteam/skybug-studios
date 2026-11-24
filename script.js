const $ = (s, r = document) => r.querySelector(s);

// id, title, client, format
const WORK = [
  ['uD_TIbJluYM', 'IFFCO Nano Fertilizers', 'IFFCO', 'Corporate film'],
  ['Zro59TZ7AO8', 'JMC Paper Tech, Corporate Video 2023', 'JMC Paper Tech', 'Corporate film'],
  ['GgMIiwjEbcA', 'SatyaSai Heart Hospital', 'SatyaSai Heart Hospital', 'Documentary'],
  ['MIVPLHvAMgk', 'Save To Sparkle', 'Aaishpra Jewellers', 'Campaign film'],
  ['cJJqpwI5LPA', 'Cosmoguru Campaign Film', 'Cosmoguru', 'Campaign film'],
  ['fe1PewIbg38', "WAFF Spray, Director's Cut", 'WAFF Spray', 'Ad film'],
  ['86QewrPGO3E', 'Cure and Beyond, Interview', 'Cure and Beyond', 'Interview'],
  ['ElJxdtZMtpQ', 'Hold Me Down', 'Music release', 'Music video'],
];
const thumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const pad = n => String(n + 1).padStart(2, '0');

// reel index
$('#list').innerHTML = WORK.map((w, i) => `
  <li><button data-i="${i}"><span class="n">${pad(i)}</span><span class="t">${w[1]}</span><span class="f">${w[3]}</span></button></li>`).join('');

let cur = 0, timer, start;
function show(i) {
  cur = i; const w = WORK[i];
  $('#shotImg').src = thumb(w[0]); $('#cClient').textContent = w[2]; $('#cFormat').textContent = w[3];
  $('#slateImg').src = thumb(w[0]); $('#slClient').textContent = w[2]; $('#slFormat').textContent = w[3];
  $('#slRoll').textContent = pad(i) + '/' + String(WORK.length).padStart(2, '0');
  document.querySelectorAll('#list button').forEach((b, k) => k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
}
// hero slate cycles through the reel
const DUR = 5500;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function tick(t) {
  if (!start) start = t;
  const p = Math.min((t - start) / DUR, 1);
  $('#slBar').style.width = p * 100 + '%';
  if (p >= 1) { start = t; show((cur + 1) % WORK.length); }
  timer = requestAnimationFrame(tick);
}
if (!reduce) timer = requestAnimationFrame(tick);
$('#slate').addEventListener('pointerenter', () => { cancelAnimationFrame(timer); });
$('#slate').addEventListener('pointerleave', () => { if (!reduce) { start = 0; timer = requestAnimationFrame(tick); } });

$('#list').addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
$('#list').addEventListener('pointerover', e => { const b = e.target.closest('button'); if (b && matchMedia('(hover:hover)').matches) show(+b.dataset.i); });
show(0);

// modal player
const modal = $('#modal'), player = $('#player');
let opener;
function play(i) {
  opener = document.activeElement;
  player.src = `https://www.youtube.com/embed/${WORK[i][0]}?autoplay=1&rel=0`;
  modal.hidden = false; document.body.style.overflow = 'hidden'; $('.modal__x').focus();
}
function close() { modal.hidden = true; player.src = ''; document.body.style.overflow = ''; opener && opener.focus(); }
$('#shot').addEventListener('click', () => play(cur));
$('#slate').addEventListener('click', () => play(cur));
$('#list').addEventListener('click', e => { if (e.target.closest('button') && !matchMedia('(hover:hover)').matches) play(cur); });
modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.modal__x')) close(); });
addEventListener('keydown', e => e.key === 'Escape' && !modal.hidden && close());

// nav
const nav = $('#nav'), burger = $('.burger');
addEventListener('scroll', () => nav.classList.toggle('s', scrollY > 30), { passive: true });
burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
document.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));
$('#yr').textContent = new Date().getFullYear();

// brief form: composes a WhatsApp message
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const text = [
    'New brief for Skybug Films',
    `Name: ${f.name}${f.company ? ' (' + f.company + ')' : ''}`,
    `Email: ${f.email}${f.phone ? ' | Phone: ' + f.phone : ''}`,
    `Format: ${f.format}`,
    `Needed by: ${f.when}`,
    '',
    f.msg,
  ].join('\n');
  open('https://wa.me/918320338296?text=' + encodeURIComponent(text), '_blank', 'noopener');
});

// reveal
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .1 });
document.querySelectorAll('.tbl tbody tr,.phases > li,.cl li,.facts p,.studio__t p').forEach((el, i) => { el.classList.add('rv'); el.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(el); });
