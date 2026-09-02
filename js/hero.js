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
    /* Sticky order bar joins once the hero (and its CTA) is mostly gone.
       Inner pages have no hero: show it after a screen of scroll. */
    if (orderBar) {
      var show = hero
        ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.45
        : window.scrollY > window.innerHeight * 0.8;
      orderBar.classList.toggle('is-visible', show);
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

  /* Click-to-play video facade: the YouTube player loads only on demand */
  document.querySelectorAll('.film__facade[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var band = btn.closest('.film');
      var frame = document.createElement('div');
      frame.className = 'film__frame';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + btn.getAttribute('data-yt') + '?autoplay=1&rel=0';
      iframe.title = btn.getAttribute('data-yt-title') || 'Video';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      frame.appendChild(iframe);
      band.appendChild(frame);
      band.classList.add('is-playing');
    }, { once: true });
  });

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

/* Map embeds: hold the Google Maps iframe (and its ~90KB of script) until the
   visitor is within a screen of it, instead of on every location page load. */
(function () {
  var frames = document.querySelectorAll('iframe[data-src]');
  if (!frames.length) return;
  function load(f) { if (!f.src) { f.src = f.getAttribute('data-src'); } }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '400px 0px' });
    frames.forEach(function (f) { io.observe(f); });
  } else {
    frames.forEach(load);
  }
})();

/* Footer email signup: one shared handler for every page. Posts to the CoreRail forms Worker,
   which emails the shop; Kevin adds the address to the Square list by hand. */
(function () {
  var forms = document.querySelectorAll('form.footer-signup');
  if (!forms.length) return;
  forms.forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var email = form.querySelector('input[name="email"]');
      var status = form.querySelector('.footer-signup__status');
      var btn = form.querySelector('button[type="submit"]');
      var trap = form.querySelector('input[name="website"]');
      if (!email || !email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        if (status) status.textContent = 'Please enter a valid email address.';
        if (email) email.focus();
        return;
      }
      if (status) status.textContent = 'Sending...';
      if (btn) btn.disabled = true;
      fetch('https://forms.creativecorerail.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: 'contact',
          topic: 'Newsletter',
          name: 'Newsletter signup',
          email: email.value.trim(),
          message: 'Please add this address to the CR Coffee Shop email list. Signed up from ' + location.pathname + '.',
          website: trap ? trap.value : ''
        })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok !== false; }); })
        .then(function (ok) {
          if (!ok) throw new Error('send failed');
          if (status) status.textContent = 'You are on the list. Thanks.';
          email.value = '';
        })
        .catch(function () {
          if (status) status.textContent = 'That did not go through. Email coastroastcoffeestroch@gmail.com and we will add you.';
        })
        .then(function () { if (btn) btn.disabled = false; });
    });
  });
})();

/* Bayou Beast: seasonal countdown to Halloween (Central time) and the found-footage
   monitor. TO TAKE IT DOWN on Nov 1: set BAYOU_BEAST_SEASON to false and bump the
   ?v= on hero.js sitewide. Every [data-beast] block also hides itself once the
   countdown reaches zero, so nothing ever shows a negative number. */
(function () {
  var BAYOU_BEAST_SEASON = true;
  var blocks = document.querySelectorAll('[data-beast]');
  if (!blocks.length) return;
  if (!BAYOU_BEAST_SEASON) { blocks.forEach(function (b) { b.hidden = true; }); return; }
  var target = new Date('2026-10-31T23:59:59-05:00').getTime();
  var timer = null;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var diff = target - Date.now();
    blocks.forEach(function (b) {
      if (diff <= 0) { b.hidden = true; return; }
      var totalMin = Math.floor(diff / 60000);
      var d = b.querySelector('[data-cd="days"]');
      var h = b.querySelector('[data-cd="hours"]');
      var m = b.querySelector('[data-cd="mins"]');
      if (d) d.textContent = String(Math.floor(totalMin / 1440));
      if (h) h.textContent = pad(Math.floor((totalMin % 1440) / 60));
      if (m) m.textContent = pad(totalMin % 60);
    });
    if (diff <= 0 && timer) clearInterval(timer);
  }
  tick();
  timer = setInterval(tick, 15000);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  document.querySelectorAll('.beast__monitor[data-video]').forEach(function (mon) {
    var btn = mon.querySelector('.beast__pause');
    var tc = mon.querySelector('[data-timecode]');
    var poster = mon.querySelector('picture') || mon.querySelector('img');
    if (reduced || saveData || !poster) return; /* the poster stands alone */
    var v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.preload = 'metadata';
    v.src = mon.getAttribute('data-video');
    var userPaused = false;
    v.addEventListener('playing', function () { v.classList.add('is-playing'); if (btn) btn.hidden = false; });
    v.addEventListener('timeupdate', function () {
      if (!tc) return;
      var s = Math.floor(v.currentTime);
      tc.textContent = '00:' + pad(Math.floor(s / 60)) + ':' + pad(s % 60);
    });
    poster.insertAdjacentElement('afterend', v);
    if (btn) {
      btn.addEventListener('click', function () {
        if (v.paused) { userPaused = false; v.play().catch(function () {}); btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', 'Pause video'); }
        else { userPaused = true; v.pause(); btn.setAttribute('aria-pressed', 'true'); btn.setAttribute('aria-label', 'Play video'); }
      });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { if (!userPaused) v.play().catch(function () {}); }
          else { v.pause(); }
        });
      }, { rootMargin: '200px 0px' });
      io.observe(mon);
    } else {
      v.play().catch(function () {});
    }
  });
})();
