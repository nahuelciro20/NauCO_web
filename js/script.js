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

// Carrusel de Proyectos
var projViewport = document.getElementById('projViewport');
var projPrev = document.getElementById('projPrev');
var projNext = document.getElementById('projNext');
var projDots = document.getElementById('projDots');

if (projViewport && projPrev && projNext) {
  var cards = projViewport.querySelectorAll('.project-card');

  function getScrollStep() {
    var firstCard = projViewport.querySelector('.project-card');
    return firstCard ? firstCard.offsetWidth + 24 : 344;
  }

  // Generar dots dinámicamente si existe el contenedor
  if (projDots && cards.length > 1) {
    projDots.innerHTML = '';
    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir al proyecto ' + (i + 1));
      dot.addEventListener('click', function () {
        cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      projDots.appendChild(dot);
    });
  }

  projNext.addEventListener('click', function () {
    var step = getScrollStep();
    var maxScroll = projViewport.scrollWidth - projViewport.clientWidth;
    if (projViewport.scrollLeft >= maxScroll - 10) {
      projViewport.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      projViewport.scrollBy({ left: step, behavior: 'smooth' });
    }
  });

  projPrev.addEventListener('click', function () {
    var step = getScrollStep();
    if (projViewport.scrollLeft <= 10) {
      projViewport.scrollTo({ left: projViewport.scrollWidth, behavior: 'smooth' });
    } else {
      projViewport.scrollBy({ left: -step, behavior: 'smooth' });
    }
  });

  if (projDots) {
    projViewport.addEventListener('scroll', function () {
      var scrollLeft = projViewport.scrollLeft;
      var step = getScrollStep();
      var activeIndex = Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / step)));
      var dots = projDots.querySelectorAll('.carousel-dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === activeIndex);
      });
    }, { passive: true });
  }
}

// Lightbox para ampliar imágenes al hacer clic y cerrar al volver a cliquear
var lightbox = document.getElementById('imageLightbox');
var lightboxImg = document.getElementById('lightboxImg');
var lightboxCaption = document.getElementById('lightboxCaption');
var lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImg) {
  function openLightbox(src, alt, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || alt || '';
    }
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) {
        lightboxImg.src = '';
      }
    }, 250);
  }

  // Activar zoom en imágenes de tarjetas de proyectos y foto "Sobre nosotros"
  var zoomableImages = document.querySelectorAll('.project-card img, .about-photo img');
  zoomableImages.forEach(function (img) {
    img.addEventListener('click', function () {
      var parentCard = img.closest('.project-card');
      var p = parentCard ? parentCard.querySelector('p') : null;
      var captionText = p ? p.textContent : img.alt;
      openLightbox(img.src, img.alt, captionText);
    });
  });

  // Cerrar al cliquear sobre la misma imagen, en el fondo o en la cruz
  lightbox.addEventListener('click', function () {
    closeLightbox();
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

