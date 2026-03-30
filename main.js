/* ============================================================
   Atlas Upholstering — Main JS
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav ---- */
  var hamburger = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileOverlay = document.getElementById('mobile-overlay');
  var mobileClose = document.getElementById('mobile-close');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    if (mobileOverlay) { mobileOverlay.style.display = 'block'; }
    document.body.style.overflow = 'hidden';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (mobileOverlay) { mobileOverlay.style.display = 'none'; }
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');

      // Close all in same group
      var group = item.closest('.faq-list, .faq-page-list');
      if (group) {
        group.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
      }

      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---- Active nav link ---- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- Quote form file upload label ---- */
  var fileInput = document.getElementById('photo-upload');
  var fileLabel = document.getElementById('file-upload-label');
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', function () {
      var names = Array.from(fileInput.files).map(function (f) { return f.name; }).join(', ');
      var span = fileLabel.querySelector('.file-name');
      if (span) span.textContent = names || 'Choose photos...';
    });
  }

  /* ---- Smooth reveal on scroll ---- */
  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent = '.reveal{opacity:0;transform:translateY(28px);transition:opacity 0.55s ease,transform 0.55s ease}.reveal.visible{opacity:1;transform:none}';
    document.head.appendChild(style);

    var revealEls = document.querySelectorAll('.service-card,.why-item,.step-card,.testimonial-card,.value-card,.faq-item');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* ---- Quote form submission ---- */
  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      var formData = new FormData(form);

      fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })
      .then(function(r) { return r.json(); })
      .then(function(json) {
        if (json.success) {
          btn.textContent = 'Request Sent!';
          btn.style.background = '#2D5A3D';
          var banner = document.createElement('div');
          banner.style.cssText = 'background:#2D5A3D;color:#fff;padding:1rem 1.5rem;border-radius:8px;margin-top:1rem;text-align:center;font-size:1rem;';
          banner.textContent = 'Thank you! We\u2019ve received your request and will be in touch within 24 hours.';
          form.appendChild(banner);
          setTimeout(function() {
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
            if (banner.parentNode) banner.parentNode.removeChild(banner);
          }, 5000);
        } else {
          btn.textContent = 'Error \u2014 Please Try Again';
          btn.disabled = false;
          btn.style.background = '#c0392b';
          setTimeout(function() { btn.textContent = originalText; btn.style.background = ''; }, 3000);
        }
      })
      .catch(function() {
        btn.textContent = 'Error \u2014 Please Try Again';
        btn.disabled = false;
        btn.style.background = '#c0392b';
        setTimeout(function() { btn.textContent = originalText; btn.style.background = ''; }, 3000);
      });
    });
  }
});
