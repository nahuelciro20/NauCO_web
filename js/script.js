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

// Lightbox para ampliar imágenes con galería por proyecto
var lightbox = document.getElementById('imageLightbox');
var lightboxImg = document.getElementById('lightboxImg');
var lightboxCaption = document.getElementById('lightboxCaption');
var lightboxCounter = document.getElementById('lightboxCounter');
var lightboxClose = document.getElementById('lightboxClose');
var lightboxPrev = document.getElementById('lightboxPrev');
var lightboxNext = document.getElementById('lightboxNext');

if (lightbox && lightboxImg) {
  var currentGallery = [];
  var currentIndex = 0;
  var currentCaption = '';

  function showGalleryImage(index) {
    if (currentGallery.length === 0) return;
    currentIndex = (index + currentGallery.length) % currentGallery.length;

    lightboxImg.style.opacity = '0.3';
    setTimeout(function () {
      lightboxImg.src = currentGallery[currentIndex];
      lightboxImg.style.opacity = '1';
    }, 90);

    if (lightboxCaption) {
      lightboxCaption.textContent = currentCaption;
    }

    if (lightboxCounter) {
      if (currentGallery.length > 1) {
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentGallery.length;
        lightboxCounter.style.display = 'inline-block';
      } else {
        lightboxCounter.style.display = 'none';
      }
    }

    var showNav = currentGallery.length > 1;
    if (lightboxPrev) lightboxPrev.classList.toggle('is-hidden', !showNav);
    if (lightboxNext) lightboxNext.classList.toggle('is-hidden', !showNav);
  }

  function openGallery(images, startIndex, caption) {
    currentGallery = images.length > 0 ? images : [''];
    currentCaption = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showGalleryImage(startIndex || 0);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) {
        lightboxImg.src = '';
        currentGallery = [];
        currentIndex = 0;
      }
    }, 250);
  }

  function getProjectImages(card, clickedImg) {
    var images = [];
    var dataAttr = card ? (card.getAttribute('data-gallery') || '') : '';
    if (!dataAttr && clickedImg) {
      dataAttr = clickedImg.getAttribute('data-gallery') || '';
    }
    if (dataAttr) {
      dataAttr.split(',').forEach(function (url) {
        var trimmed = url.trim();
        if (trimmed && images.indexOf(trimmed) === -1) {
          images.push(trimmed);
        }
      });
    }

    if (card) {
      var imgs = card.querySelectorAll('img');
      imgs.forEach(function (im) {
        var s = im.getAttribute('src');
        if (s && images.indexOf(s) === -1) {
          images.push(s);
        }
      });
    }

    var mainSrc = clickedImg ? clickedImg.getAttribute('src') : '';
    if (images.length === 0 && mainSrc) {
      images.push(mainSrc);
    }
    return images;
  }

  var zoomableImages = document.querySelectorAll('.project-card img, .about-photo img');
  zoomableImages.forEach(function (img) {
    img.addEventListener('click', function () {
      var parentCard = img.closest('.project-card');
      var p = parentCard ? parentCard.querySelector('p') : null;
      var captionText = p ? p.textContent.replace(/<!--[\s\S]*?-->/g, '').trim() : img.alt;
      var galleryList = getProjectImages(parentCard, img);
      var initialIdx = 0;
      var clickedSrc = img.getAttribute('src');
      var foundIdx = galleryList.indexOf(clickedSrc);
      if (foundIdx !== -1) initialIdx = foundIdx;

      openGallery(galleryList, initialIdx, captionText);
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      showGalleryImage(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      showGalleryImage(currentIndex + 1);
    });
  }

  lightbox.addEventListener('click', function (e) {
    if (e.target.closest('.lightbox-nav-btn') || e.target.closest('.lightbox-footer')) {
      return;
    }
    closeLightbox();
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft' && currentGallery.length > 1) {
      showGalleryImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight' && currentGallery.length > 1) {
      showGalleryImage(currentIndex + 1);
    }
  });

  var touchStartX = 0;
  var touchEndX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diffX = touchEndX - touchStartX;
    if (Math.abs(diffX) > 40 && currentGallery.length > 1) {
      if (diffX < 0) {
        showGalleryImage(currentIndex + 1);
      } else {
        showGalleryImage(currentIndex - 1);
      }
    }
  }, { passive: true });
}

