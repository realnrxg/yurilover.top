// copy discord username
function copyDiscord() {
  var id = "nrxg";
  navigator.clipboard.writeText(id).then(function () {
    var t = document.getElementById("toast");
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 2000);
  });
}

// titl
var box = document.querySelector('.box');

document.addEventListener('mousemove', function (e) {
  // center
  var midX = window.innerWidth / 2;
  var midY = window.innerHeight / 2;

  // degress 
  var rotateY = ((e.clientX - midX) / midX) * 5;
  var rotateX = ((midY - e.clientY) / midY) * 5;

  box.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
});

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
