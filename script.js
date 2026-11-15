const svgNS = 'http://www.w3.org/2000/svg';
const mobile = matchMedia('(max-width: 600px), (pointer: coarse)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
function radial(parent, angle, start, end, color, width = 1) {
  const element = document.createElementNS(svgNS, 'line');
  const attrs = {x1:500+Math.cos(angle)*start,y1:500+Math.sin(angle)*start,x2:500+Math.cos(angle)*end,y2:500+Math.sin(angle)*end,stroke:color,'stroke-width':width};
  Object.entries(attrs).forEach(([key,value]) => element.setAttribute(key,value));
  parent.append(element);
}
const rays = document.getElementById('rays');
const marks = document.getElementById('haloMarks');
const fibers = document.getElementById('irisFibers');
for (let i = 0; i < 180; i += mobile.matches ? 2 : 1) {
  const angle = i*Math.PI/90, wave = Math.sin(i*2.39)*18;
  radial(rays,angle,278+wave/3,310+wave+(i%3===0?30:0),'url(#gold)',i%3===0?1.1:.5);
  radial(marks,angle,367,i%5===0?379:371,'#7b7b7b',.65);
  radial(fibers,angle,20+Math.sin(i*1.7)*2,108+Math.sin(i*2.7)*4,i%3===0?'#c6c6c6':'#292929',i%3===0?.8:1.5);
}
const dust = document.querySelector('.dust');
for (let i=0;i<(mobile.matches ? 12 : 38);i++) {
  const mote = document.createElement('i');
  mote.style.cssText = `--x:${(i*73.13)%100}%;--y:${(i*37.7)%100}%;--duration:${12+i%13}s;--delay:-${i%19}s`;
  dust.append(mote);
}
const gaze = document.getElementById('gaze');
const eye = document.querySelector('.sigil');
const artifact = document.querySelector('.artifact');
const reflection = document.getElementById('reflectionLayer');
const upperLid = document.getElementById('upperLid');
const lowerLid = document.getElementById('lowerLid');
const lidEdge = document.getElementById('lidEdge');
function setChanged(element, name, value) {
  const text = String(value);
  if (element.getAttribute(name) !== text) element.setAttribute(name, text);
}
let previousBlink = -1;
function setBlink(closed) {
  if (closed === previousBlink) return;
  previousBlink = closed;
  // The upper lid does most of the travel; both meet below the eye's center.
  const upper = 270 + 350 * closed;
  const lower = 730 - 110 * closed;
  upperLid.setAttribute('d', `M251 500Q500 270 749 500Q500 ${upper} 251 500Z`);
  lowerLid.setAttribute('d', `M251 500Q500 730 749 500Q500 ${lower} 251 500Z`);
  lidEdge.setAttribute('d', `M251 500Q500 ${upper} 749 500`);
}
const started = performance.now();
let nextBlink = started + 4200, doubleBlink = false;
let nextLook = 0, idleX = 0, idleY = 0;
let hoveredLink = null, focusedLink = null;
const links = document.querySelector('.links');
links.addEventListener('pointerover', event => { hoveredLink = event.target.closest('.icon-btn'); });
links.addEventListener('pointerleave', () => { hoveredLink = null; });
links.addEventListener('focusin', event => { focusedLink = event.target.closest('.icon-btn'); });
links.addEventListener('focusout', () => { focusedLink = null; });
let pointer = null, lastMove = -Infinity, x = 0, y = 0, frame;
let previousFrame = null, eyeBounds = null;
function invalidateBounds() { eyeBounds = null; }
window.addEventListener('resize', invalidateBounds, {passive: true});
window.addEventListener('scroll', invalidateBounds, {passive: true});
mobile.addEventListener('change', () => {
  artifact.style.transform = '';
  invalidateBounds();
});
const pupil = document.querySelector('.pupil');
const ripple = document.getElementById('reactionRipple');
let reactedAt = -Infinity;
document.querySelector('.eye-trigger').addEventListener('click', () => {
  reactedAt = performance.now();
  nextBlink = reactedAt + 2200;
  if (motion.matches) setChanged(gaze, 'transform', 'translate(0 0)');
});
document.addEventListener('pointerup', event => {
  if (event.pointerType !== 'touch') return;
  pointer = {x: event.clientX, y: event.clientY};
  lastMove = performance.now();
}, {passive: true});
document.addEventListener('pointermove',event => {
  if(event.pointerType==='touch') return;
  pointer = {x:event.clientX,y:event.clientY};
  lastMove = performance.now();
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{pointer=null;});
function animate(time) {
  const elapsed = previousFrame === null ? 1000 / 60 : Math.min(100, time - previousFrame);
  previousFrame = time;
  let blinkTime = time - nextBlink;
  if (blinkTime >= 320) {
    const repeat = !doubleBlink && Math.random() < .18;
    nextBlink = time + (repeat ? 130 : 3000 + Math.random() * 4200);
    doubleBlink = repeat;
    blinkTime = -1;
  }
  const closed = blinkTime < 0 || blinkTime >= 320 ? 0
    : blinkTime < 100 ? Math.sin(blinkTime / 100 * Math.PI / 2)
    : blinkTime < 140 ? 1 : Math.cos((blinkTime - 140) / 180 * Math.PI / 2);
  const entrance = Math.max(0, Math.min(1, (time - started - 650) / 900));
  const blinkAmount = Math.max(closed, 1 - entrance * entrance * (3 - 2 * entrance));
  if (time >= nextLook) {
    idleX = (Math.random() - .5) * 60;
    idleY = (Math.random() - .5) * 28;
    nextLook = time + 1400 + Math.random() * 2400;
  }
  let targetX = idleX, targetY = idleY;
  const activeLink = hoveredLink || focusedLink;
  let attention = pointer;
  if (activeLink) {
    const bounds = activeLink.getBoundingClientRect();
    attention = {x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2};
  }
  if(attention && (activeLink || time-lastMove<3500)) {
    const rect = eyeBounds || (eyeBounds = eye.getBoundingClientRect());
    targetX = Math.max(-56,Math.min(56,(attention.x-rect.left-rect.width/2)/rect.width*135));
    targetY = Math.max(-27,Math.min(27,(attention.y-rect.top-rect.height/2)/rect.height*85));
  }
  setBlink(blinkAmount);
  const reaction = time - reactedAt;
  if (reaction < 1100) { targetX = 0; targetY = 0; }
  setChanged(pupil, 'r', 20 - (reaction < 700 ? 7 * Math.sin(Math.PI * reaction / 700) : 0));
  setChanged(ripple, 'r', 130 + Math.min(reaction / 1100, 1) * 290);
  setChanged(ripple, 'opacity', reaction < 1100 ? .32 * Math.sin(Math.PI * reaction / 1100) : 0);
  const smoothing = 1 - Math.exp(-elapsed / 295);
  x += (targetX - x) * smoothing;
  y += (targetY - y) * smoothing;
  setChanged(gaze, 'transform',`translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  if (!mobile.matches) artifact.style.transform = `perspective(1100px) rotateX(${(-y * .16).toFixed(2)}deg) rotateY(${(x * .16).toFixed(2)}deg)`;
  setChanged(reflection, 'transform', `translate(${(-x * .2).toFixed(2)} ${(-y * .2).toFixed(2)})`);
  frame=requestAnimationFrame(animate);
}
function updateMotion() {
  cancelAnimationFrame(frame);
  previousFrame = null;
  invalidateBounds();
  if(!motion.matches&&!document.hidden) frame=requestAnimationFrame(animate);
  else {
    setBlink(0);
    setChanged(pupil, 'r', 20);
    setChanged(ripple, 'opacity', 0);
    gaze.removeAttribute('transform');
    reflection.removeAttribute('transform');
    artifact.style.transform = '';
  }
}
motion.addEventListener('change',updateMotion);
document.addEventListener('visibilitychange',updateMotion);
updateMotion();
const discord=document.getElementById('discordBtn');
const status=document.getElementById('status');
let feedbackTimer;
discord.addEventListener('click',async()=>{
  clearTimeout(feedbackTimer);
  discord.classList.remove('copied','failed');
  try {
    await navigator.clipboard.writeText('nrxg');
    discord.classList.add('copied');
    status.textContent='Discord username nrxg copied.';
  } catch {
    discord.classList.add('failed');
    status.textContent='Clipboard unavailable. Discord username: nrxg.';
    window.prompt('Copy Discord username:','nrxg');
  }
  feedbackTimer=setTimeout(()=>{
    discord.classList.remove('copied','failed');status.textContent='';
  },2200);
});
