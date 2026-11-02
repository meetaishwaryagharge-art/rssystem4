/* RS Systems & Solutions: shared page enhancements */
(function () {
  'use strict';
  var PHONE = '919004657056';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- Hero stage: thumbnail switcher ---- */
  $$('[data-rs-stage]').forEach(function (stage) {
    var main = $('[data-rs-main]', stage), tag = $('.rs-stage-tag', stage), thumbs = $$('.rs-thumb', stage);
    if (!main || !thumbs.length) return;
    function show(btn) {
      thumbs.forEach(function (t) { t.classList.toggle('is-active', t === btn); });
      main.classList.add('is-swapping');
      setTimeout(function () {
        main.src = btn.dataset.src; main.alt = btn.dataset.label;
        if (tag) tag.textContent = btn.dataset.label;
        main.classList.remove('is-swapping');
      }, 220);
    }
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t); });
    });
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (thumbs.length > 1 && !reduce) {
      var idx = 0, timer = setInterval(next, 4500);
      function next() { idx = (idx + 1) % thumbs.length; show(thumbs[idx]); }
      stage.addEventListener('mouseenter', function () { clearInterval(timer); });
      thumbs.forEach(function (t, i) { t.addEventListener('click', function () { idx = i; clearInterval(timer); }); });
    }
  });

  /* ---- Home hero slideshow ---- */
  $$('[data-rs-slides]').forEach(function (box) {
    var root = box.closest('.rs-stage'), imgs = $$('img', box), tag = $('.rs-stage-tag', root), dots = $$('.rs-dots button', root), i = 0;
    function go(n) {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
      if (tag) tag.textContent = imgs[i].dataset.label;
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    go(0);
    if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) setInterval(function () { go(i + 1); }, 3800);
  });

  /* ---- Product cards: number badge, zoom hint, WhatsApp / call buttons ---- */
  var page = document.body.getAttribute('data-rs-page');
  if (page === 'product') {
    $$('.reveal.grid[id]').forEach(function (card, n) {
      var panel = $('.rs-imgpanel', card);
      if (panel && !$('.rs-badge-num', panel)) {
        var b = document.createElement('span'); b.className = 'rs-badge-num'; b.textContent = '0' + (n + 1); panel.insertBefore(b, panel.firstChild);
      }
      var cta = $('[data-enquire]', card);
      if (cta && !$('.rs-btn-wa', card)) {
        var name = cta.dataset.enquire, wrap = document.createElement('div'); wrap.className = 'rs-card-actions';
        cta.parentNode.insertBefore(wrap, cta); wrap.appendChild(cta);
        var wa = document.createElement('a'); wa.className = 'rs-btn-wa'; wa.target = '_blank'; wa.rel = 'noopener';
        wa.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Hello RS Systems, I would like a quote for: ' + name);
        wa.innerHTML = '<i class="fa-brands fa-whatsapp"></i> WhatsApp';
        var call = document.createElement('a'); call.className = 'rs-btn-call'; call.href = 'tel:+' + PHONE;
        call.innerHTML = '<i class="fa-solid fa-phone"></i> Call';
        wrap.appendChild(wa); wrap.appendChild(call);
      }
    });
  }
  $$('.rs-imgpanel').forEach(function (p) {
    if (!$('.rs-zoom-hint', p)) { var z = document.createElement('span'); z.className = 'rs-zoom-hint'; z.innerHTML = '<i class="fa-solid fa-expand"></i>'; p.appendChild(z); }
  });

  /* ---- Lightbox ---- */
  var lb = document.createElement('div'); lb.id = 'rs-lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = '<button type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  var lbImg = $('img', lb), lbCap = $('figcaption', lb);
  function openLb(src, alt) { lbImg.src = src; lbImg.alt = alt || ''; lbCap.textContent = alt || ''; lb.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.classList.remove('is-open'); document.body.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.rs-imgpanel, .rs-stage-main[data-zoomable]');
    if (t && !e.target.closest('a')) { var im = $('img.is-on', t) || $('img', t); if (im) openLb(im.currentSrc || im.src, im.alt); }
    else if (e.target === lb || e.target.closest('#rs-lightbox button')) closeLb();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* ---- Sticky sub-nav scroll spy ---- */
  var pills = $$('.rs-subnav a.rs-pill');
  if (pills.length && 'IntersectionObserver' in window) {
    var map = {};
    pills.forEach(function (p) { var id = (p.getAttribute('href') || '').slice(1), el = id && document.getElementById(id); if (el) map[id] = { p: p, el: el }; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { pills.forEach(function (p) { p.classList.remove('is-active'); }); map[en.target.id].p.classList.add('is-active'); }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { spy.observe(map[id].el); });
  }

  /* ---- Mobile action bar ---- */
  if (page === 'product') {
    var bar = document.createElement('div'); bar.className = 'rs-mobilebar';
    var h1 = $('h1'), title = h1 ? h1.textContent.trim() : 'your products';
    bar.innerHTML = '<a class="c" href="tel:+' + PHONE + '"><i class="fa-solid fa-phone"></i> Call</a>' +
      '<a class="w" target="_blank" rel="noopener" href="https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Hello RS Systems, I am interested in: ' + title) + '"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>' +
      '<a class="q" href="#contact"><i class="fa-solid fa-file-invoice"></i> Get quote</a>';
    document.body.appendChild(bar);
  }
})();

/* ---- Hero background carousel (home + inner pages) ---- */
(function () {
  'use strict';
  var hero = document.querySelector('[data-rs-hero]');
  if (!hero) return;
  var slides = [].slice.call(hero.querySelectorAll('.hs'));
  if (!slides.length) return;
  var dots = [].slice.call(hero.querySelectorAll('.rs-hero-dots button'));
  var bar = hero.querySelector('.rs-hero-progress i');
  var tag = hero.querySelector('[data-rs-tag]');
  var cap = hero.querySelector('.rs-hero-caption');
  var prev = hero.querySelector('.rs-hero-arrow.prev'), next = hero.querySelector('.rs-hero-arrow.next');
  var cur = 0, timer = null, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slides.length < 2) hero.classList.add('is-single');
  function show(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === cur); });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    var d = slides[cur].dataset;
    if (tag) tag.lastChild.textContent = d.name;
    if (cap) {
      cap.querySelector('.hc-cat').textContent = d.cat || '';
      cap.querySelector('.hc-name').textContent = d.name;
      cap.querySelector('.hc-tag').textContent = d.tagline || '';
      if (d.enq) cap.setAttribute('data-enquire', d.enq);
    }
    if (bar && !reduce) { bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); }
  }
  function start() { clearInterval(timer); if (slides.length > 1 && !reduce) timer = setInterval(function () { show(cur + 1); }, 5000); }
  function stop() { clearInterval(timer); if (bar) bar.classList.remove('run'); }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); start(); }); });
  if (prev) prev.addEventListener('click', function () { show(cur - 1); start(); });
  if (next) next.addEventListener('click', function () { show(cur + 1); start(); });
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', function () { show(cur); start(); });
  show(0); start();
})();
