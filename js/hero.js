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

  /* Mobile nav overlay */
  var burger = document.getElementById('nav-burger');
  var mobileNav = document.getElementById('mobile-nav');
  var navClose = document.getElementById('nav-close');
  if (burger && mobileNav && navClose) {
    function openNav() {
      mobileNav.hidden = false;
      document.body.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      navClose.focus();
    }
    function closeNav() {
      mobileNav.hidden = true;
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
    burger.addEventListener('click', openNav);
    navClose.addEventListener('click', closeNav);
    mobileNav.addEventListener('click', function (e) {
      var link = e.target.closest('.mobile-nav__link');
      if (!link) return;
      var href = link.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        /* Close first, then scroll: the default anchor scroll fires while the
           body is still scroll-locked by the overlay and silently does nothing. */
        e.preventDefault();
        closeNav();
        var target = document.querySelector(href);
        if (target) {
          var smooth = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
          target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
          if (history.pushState) history.pushState(null, '', href);
        }
      } else {
        closeNav();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (mobileNav.hidden) return;
      if (e.key === 'Escape') { closeNav(); return; }
      if (e.key === 'Tab') { /* keep focus inside the dialog */
        var focusables = mobileNav.querySelectorAll('a, button');
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* Live open/closed chips on the location strip */
  function fmtHour(h) {
    if (h === 12) return 'noon';
    return h < 12 ? h + 'am' : (h - 12) + 'pm';
  }
  document.querySelectorAll('.open-status[data-hours]').forEach(function (el) {
    try {
      var hours = JSON.parse(el.getAttribute('data-hours'));
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', hour12: false
      }).formatToParts(new Date());
      var dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var day = null, hour = null;
      parts.forEach(function (p) {
        if (p.type === 'weekday') day = dayMap[p.value];
        if (p.type === 'hour') hour = parseInt(p.value, 10) % 24;
      });
      var today = hours[String(day)];
      if (!today) return;
      if (hour >= today[0] && hour < today[1]) {
        el.textContent = 'Open until ' + fmtHour(today[1]);
        el.classList.add('open-status--open');
      } else if (hour < today[0]) {
        el.textContent = 'Opens at ' + fmtHour(today[0]);
      } else {
        var next = hours[String((day + 1) % 7)];
        el.textContent = next ? 'Opens at ' + fmtHour(next[0]) + ' tomorrow' : 'Closed';
      }
    } catch (e) { /* static hours text stands */ }
  });

  /* Section reveal: gentle fade-up once, CSS-gated for reduced motion */
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in-view'); });
  }

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
       encoded from the 4K master; landscape gets the full-frame 1080p.
       Browsers that decode AV1 (all modern ones) get the 10-bit AV1
       encodes: cleaner dark gradients, native-resolution portrait. */
    var canAV1 = video.canPlayType('video/mp4; codecs="av01.0.08M.10"') !== '';
    var portrait = window.matchMedia('(orientation: portrait)').matches;
    video.src = portrait
      ? (canAV1 ? '/video/hero-loop-portrait-2160.av1.mp4?v=6' : '/video/hero-loop-portrait.mp4?v=6')
      : (canAV1 ? '/video/hero-loop-1920.av1.mp4?v=6' : '/video/hero-loop-1920.mp4?v=6');

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
