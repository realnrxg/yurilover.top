var card = document.getElementById('card');
var toggleBtn = document.getElementById('toggleBtn');
var viewMain = document.getElementById('viewMain');
var viewOs = document.getElementById('viewOs');

// copy discord username
document.getElementById('discordBtn').addEventListener('click', function () {
  navigator.clipboard.writeText('nrxg').then(function () {
    var t = document.getElementById('toast');
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2000);
  });
});

// toggle between main and os panel
toggleBtn.addEventListener('click', function () {
  var showOs = card.classList.toggle('show-os');
  toggleBtn.setAttribute('aria-expanded', showOs);
  viewOs.hidden = !showOs;
  viewMain.hidden = showOs;
});

// subtle tilt, fine pointers only, off for reduced motion
var fineMotion = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (fineMotion) {
  var raf = null;
  document.addEventListener('mousemove', function (e) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      var x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      var y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      card.style.transform = 'perspective(900px) rotateY(' + (x * 2.5) + 'deg) rotateX(' + (-y * 2.5) + 'deg)';
      raf = null;
    });
  });
}
