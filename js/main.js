// Mobile nav toggle
(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Scroll reveal
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();

// Lightbox gallery (expects .frame elements with data-full and data-caption)
(function () {
  var frames = document.querySelectorAll('.frame[data-full]');
  if (!frames.length) return;

  var photos = Array.prototype.map.call(frames, function (f) {
    return { full: f.getAttribute('data-full'), caption: f.getAttribute('data-caption') || '' };
  });

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var currentIdx = 0;

  function showIndex(i) {
    currentIdx = (i + photos.length) % photos.length;
    var p = photos[currentIdx];
    lightboxImg.src = p.full;
    lightboxImg.alt = p.caption;
    lightboxCaption.textContent = p.caption;
  }
  function openLightbox(i) {
    showIndex(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  }

  frames.forEach(function (frame, i) {
    frame.setAttribute('tabindex', '0');
    frame.setAttribute('role', 'button');
    frame.addEventListener('click', function () { openLightbox(i); });
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function (e) { e.stopPropagation(); showIndex(currentIdx - 1); });
  document.getElementById('lightboxNext').addEventListener('click', function (e) { e.stopPropagation(); showIndex(currentIdx + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showIndex(currentIdx - 1);
    if (e.key === 'ArrowRight') showIndex(currentIdx + 1);
  });
})();
