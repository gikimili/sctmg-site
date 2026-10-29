/* Static legal pages: language selection and same-origin legacy aliases only. */
(function () {
  'use strict';
  var languages = ['en', 'fr', 'es', 'de'];
  var alias = document.body.getAttribute('data-alias');
  if (['privacy', 'terms', 'support', 'apps', 'privacy-account', 'terms-account'].includes(alias)) {
    var destination = new URL('./' + alias + '/', location.href);
    destination.search = location.search;
    destination.hash = location.hash;
    location.replace(destination.href);
    return;
  }
  var query = new URLSearchParams(location.search).get('lang');
  var preferred = Array.from(navigator.languages || [navigator.language || 'en'])
    .map(function (value) { return String(value).slice(0, 2).toLowerCase(); })
    .find(function (value) { return languages.includes(value); });
  var lang = languages.includes(query) ? query : (preferred || 'en');
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(function (element) {
    element.hidden = element.getAttribute('data-lang') !== lang;
  });
  document.querySelectorAll('[data-lang-link]').forEach(function (link) {
    if (link.getAttribute('data-lang-link') === lang) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('a[data-local-link]').forEach(function (link) {
    var destination = new URL(link.getAttribute('href'), location.href);
    if (destination.origin !== location.origin) return;
    destination.searchParams.set('lang', lang);
    link.setAttribute('href', destination.pathname + destination.search + destination.hash);
  });
  var content = document.querySelector('[data-lang="' + lang + '"][data-page-title]');
  if (content) {
    document.title = content.getAttribute('data-page-title');
    var descriptions = {
      '.nav': 'data-nav-label', '.langs': 'data-language-label', '.foot-nav': 'data-footer-label'
    };
    Object.keys(descriptions).forEach(function (selector) {
      var element = document.querySelector(selector);
      if (element) element.setAttribute('aria-label', content.getAttribute(descriptions[selector]));
    });
  }
  if (query !== lang) {
    var normalized = new URL(location.href);
    normalized.searchParams.set('lang', lang);
    history.replaceState(null, '', normalized.pathname + normalized.search + normalized.hash);
  }
})();
