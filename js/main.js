// Mobile nav toggle
(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  toggle.addEventListener('click', function () {
    setOpen(!links.classList.contains('open'));
  });
  document.addEventListener('click', function (e) {
    if (!links.classList.contains('open')) return;
    if (!links.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });
})();

// Back to top
(function () {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
  document.body.appendChild(btn);
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 700);
  }, { passive: true });
})();

// Copy-to-clipboard buttons (data-copy="text")
(function () {
  var buttons = document.querySelectorAll('[data-copy]');
  if (!buttons.length || !navigator.clipboard) return;
  buttons.forEach(function (btn) {
    var defaultLabel = btn.textContent;
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        btn.textContent = 'Copiado';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = defaultLabel;
          btn.classList.remove('copied');
        }, 1800);
      });
    });
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
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var focusable = [prevBtn, nextBtn, closeBtn];
  var currentIdx = 0;
  var lastFocused = null;

  function showIndex(i) {
    currentIdx = (i + photos.length) % photos.length;
    var p = photos[currentIdx];
    lightboxImg.classList.remove('loaded');
    lightboxImg.src = p.full;
    lightboxImg.alt = p.caption;
    lightboxCaption.textContent = p.caption;
  }
  lightboxImg.addEventListener('load', function () {
    if (lightboxImg.src) lightboxImg.classList.add('loaded');
  });
  function openLightbox(i, trigger) {
    lastFocused = trigger || document.activeElement;
    showIndex(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImg.src = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  frames.forEach(function (frame, i) {
    frame.setAttribute('tabindex', '0');
    frame.setAttribute('role', 'button');
    if (photos[i].caption) frame.setAttribute('aria-label', 'Ver foto: ' + photos[i].caption);
    frame.addEventListener('click', function () { openLightbox(i, frame); });
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i, frame); }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); showIndex(currentIdx - 1); });
  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); showIndex(currentIdx + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowLeft') showIndex(currentIdx - 1);
    if (e.key === 'ArrowRight') showIndex(currentIdx + 1);
    if (e.key === 'Tab') {
      var idx = focusable.indexOf(document.activeElement);
      var next = e.shiftKey ? idx - 1 : idx + 1;
      if (next < 0) next = focusable.length - 1;
      if (next >= focusable.length) next = 0;
      if (idx === -1) return;
      e.preventDefault();
      focusable[next].focus();
    }
  });
})();
