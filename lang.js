/* ============================================================
   Atlas Upholstering — Language Toggle (EN/FR)
   ============================================================ */
(function () {
  var STORAGE_KEY = 'atlas_lang';
  var current = localStorage.getItem(STORAGE_KEY) || 'en';

  function applyLang(lang) {
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'fr' ? 'fr-CA' : 'en-CA';

    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
      if (text !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    document.querySelectorAll('[data-en-attr]').forEach(function (el) {
      var attr = el.getAttribute('data-en-attr');
      var val  = lang === 'fr' ? el.getAttribute('data-fr-val') : el.getAttribute('data-en-val');
      if (attr && val !== null) el.setAttribute(attr, val);
    });

    document.querySelectorAll('.lang-toggle-btn').forEach(function (btn) {
      btn.textContent = lang === 'fr' ? '🌐 EN' : '🌐 FR';
      btn.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer au français');
    });

    // canonical hreflang
    var hreflangSelf = document.querySelector('link[hreflang="' + (lang === 'fr' ? 'fr-CA' : 'en-CA') + '"]');
    if (hreflangSelf) {
      var canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = hreflangSelf.href;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(current);

    document.querySelectorAll('.lang-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(current === 'en' ? 'fr' : 'en');
      });
    });
  });
})();
