var siteHeader = document.querySelector('header');
function onScroll() {
  if (window.scrollY > 40) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

var navToggle = document.getElementById('navToggle');
var primaryNav = document.getElementById('primaryNav');

if (navToggle && primaryNav) {
  function toggleMenu(open) {
    var isOpen = open !== undefined ? open : !primaryNav.classList.contains('is-open');
    navToggle.classList.toggle('open', isOpen);
    primaryNav.classList.toggle('is-open', isOpen);
    siteHeader.classList.toggle('menu-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }

  navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  var navLinks = primaryNav.querySelectorAll('a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  document.addEventListener('click', function (e) {
    if (!siteHeader.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function (el) {
    el.classList.add('in-view');
  });
}
