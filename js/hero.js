/* CR Coffee next — hero prototype behavior
   Poster paints first (it is the LCP element); the background video is injected
   after window load so it never competes with the first paint, and is skipped
   entirely for reduced-motion or Save-Data visitors. */
(function () {
  'use strict';

  /* Footer year */
  var yearEl = document.getElementById('js-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Header: transparent over the hero, glass once scrolled */
  var header = document.getElementById('header');
  var orderBar = document.querySelector('.mobile-order-bar');
  var hero = document.getElementById('hero');
  function onScroll() {
    if (header) header.classList.toggle('header--solid', window.scrollY > 24);
    /* Sticky order bar joins once the hero (and its CTA) is mostly gone */
    if (orderBar && hero) {
      var heroBottom = hero.getBoundingClientRect().bottom;
      orderBar.classList.toggle('is-visible', heroBottom < window.innerHeight * 0.45);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Background video */
  var media = document.querySelector('.hero__media');
  var pauseBtn = document.getElementById('hero-pause');
  if (!media || !pauseBtn) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reducedMotion || saveData) return; /* poster stands alone */

  var userPaused = false;
  var video = null;

  function injectVideo() {
    video = document.createElement('video');
    video.className = 'hero__video';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.preload = 'auto';
    /* Bump ?v= on every recut. Portrait screens get a dedicated 9:16 crop
       encoded from the 4K master; landscape gets the full-frame 1080p. */
    video.src = window.matchMedia('(orientation: portrait)').matches
      ? '/video/hero-loop-portrait.mp4?v=3'
      : '/video/hero-loop-1920.mp4?v=3';

    video.addEventListener('playing', function () {
      video.classList.add('is-playing');
      pauseBtn.hidden = false;
    }, { once: true });

    media.insertBefore(video, media.querySelector('.hero__scrim'));
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay refused: poster stands alone */ });
  }

  function setPaused(paused) {
    if (!video) return;
    userPaused = paused;
    if (paused) { video.pause(); } else { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.querySelector('.hero__pause-label').textContent = paused ? 'Play video' : 'Pause video';
  }

  pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });

  /* Save battery: stop playback while the hero is off screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (!video || userPaused) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
        else { video.pause(); }
      });
    }, { threshold: 0.05 }).observe(media);
  }

  if (document.readyState === 'complete') { injectVideo(); }
  else { window.addEventListener('load', injectVideo, { once: true }); }
})();
