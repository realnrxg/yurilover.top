// copy discord username
function copyDiscord() {
  var id = "nrxg";
  navigator.clipboard.writeText(id).then(function () {
    var t = document.getElementById("toast");
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 2000);
  });
}

// titl (desktop-only: phones/touch devices skip this entirely so they
// never attach the listener or pay for the extra compositing layer)
var box = document.querySelector('.box');
var supportsTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsTilt) {
  var tiltTicking = false;
  var lastX = window.innerWidth / 2;
  var lastY = window.innerHeight / 2;

  document.addEventListener('mousemove', function (e) {
    lastX = e.clientX;
    lastY = e.clientY;

    if (!tiltTicking) {
      requestAnimationFrame(applyTilt);
      tiltTicking = true;
    }
  });

  function applyTilt() {
    // center
    var midX = window.innerWidth / 2;
    var midY = window.innerHeight / 2;

    // degress
    var rotateY = ((lastX - midX) / midX) * 5;
    var rotateX = ((midY - lastY) / midY) * 5;

    box.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    tiltTicking = false;
  }
}

// toggle between main and os
var toggleBtn = document.getElementById('toggleBtn');

function togglePanel() {
  box.classList.toggle('show-panel');

  // swap arrow direction
  var icon = toggleBtn.querySelector('i');
  if (box.classList.contains('show-panel')) {
    icon.className = 'fa-solid fa-chevron-left';
  } else {
    icon.className = 'fa-solid fa-chevron-right';
  }
}
