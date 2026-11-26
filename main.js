import { initVisitorCounter } from './stats.js';
import { initImageLibrary } from './image-library.js';

// ==========================================
// Language Switcher (Default: English 'en')
// ==========================================
const langBtnTh = document.getElementById('lang-btn-th');
const langBtnEn = document.getElementById('lang-btn-en');

function updateLanguageButtons() {
  const isEnglish = document.documentElement.lang === 'en';
  langBtnTh?.setAttribute('aria-pressed', String(!isEnglish));
  langBtnEn?.setAttribute('aria-pressed', String(isEnglish));
}

function setLanguage(lang) {
  document.documentElement.lang = lang;
  updateLanguageButtons();
  filterWork(workFilter);

  try {
    localStorage.setItem('user_lang_pref', lang);
  } catch {
    // The switch still works for this page when storage is unavailable.
  }
}

updateLanguageButtons();
langBtnTh?.addEventListener('click', () => setLanguage('th'));
langBtnEn?.addEventListener('click', () => setLanguage('en'));

const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
function updateNavigationLocation() {
  const id = location.hash.slice(1) || 'home';
  const section = document.getElementById(id)?.closest('section');
  const sectionHash = section ? '#' + section.id : '';
  navLinks.forEach(link => {
    if (link.hash === sectionHash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
updateNavigationLocation();
window.addEventListener('hashchange', updateNavigationLocation);

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Medical wireframe slideshow and background loop
const hero = document.getElementById('home');
const heroBackground = hero.querySelector('.hero-background');
const heroArt = hero.querySelector('.hero-art');
const heroSlides = document.getElementById('hero-slides');
const slideCaptions = [...heroSlides.querySelectorAll('figcaption a')];
const slideProgress = hero.querySelector('.hero-slide-progress');
const slideIndicators = [...slideProgress.children];
const reduceHeroMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlide = 0;
let slideTimer;
let heroVisible = false;
let hoveringGallery = false;
let touchingGallery = false;

function canPlayHeroMotion() {
  return heroVisible && !document.hidden && !reduceHeroMotion.matches
    && !hoveringGallery && !touchingGallery && !heroArt.matches(':focus-within');
}

function updateHeroSlide() {
  activeSlide = Math.max(0, Math.min(slideCaptions.length - 1,
    Math.round(heroSlides.scrollLeft / heroSlides.clientWidth)));
  slideIndicators.forEach((indicator, index) => indicator.classList.toggle('active', index === activeSlide));
  slideCaptions.forEach((caption, index) => {
    caption.tabIndex = index === activeSlide ? 0 : -1;
  });
}

function showHeroSlide(index, instant = false) {
  heroSlides.scrollTo({ left: index * heroSlides.clientWidth, behavior: instant ? 'instant' : 'auto' });
}

function scheduleHeroSlide() {
  clearTimeout(slideTimer);
  if (!canPlayHeroMotion()) return;

  slideTimer = setTimeout(() => {
    const next = (activeSlide + 1) % slideCaptions.length;
    showHeroSlide(next, next === 0);
  }, 5000);
}

function syncHeroMedia() {
  if (canPlayHeroMotion()) {
    if (!heroBackground.hasAttribute('src')) heroBackground.src = heroBackground.dataset.src;
    if (heroBackground.paused) heroBackground.play().catch(() => {});
  } else {
    heroBackground.pause();
  }
  if (reduceHeroMotion.matches) hero.classList.remove('has-background');
  scheduleHeroSlide();
}

slideProgress.hidden = false;
heroBackground.addEventListener('playing', () => hero.classList.add('has-background'));
heroArt.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'mouse') return;
  hoveringGallery = true;
  syncHeroMedia();
});
heroArt.addEventListener('pointerleave', event => {
  if (event.pointerType !== 'mouse') return;
  hoveringGallery = false;
  syncHeroMedia();
});
heroArt.addEventListener('focusin', syncHeroMedia);
heroArt.addEventListener('focusout', () => queueMicrotask(syncHeroMedia));
heroSlides.addEventListener('touchstart', () => {
  touchingGallery = true;
  syncHeroMedia();
}, { passive: true });
for (const type of ['touchend', 'touchcancel']) {
  heroSlides.addEventListener(type, () => {
    touchingGallery = false;
    syncHeroMedia();
  }, { passive: true });
}
heroSlides.addEventListener('scroll', () => {
  updateHeroSlide();
  scheduleHeroSlide();
}, { passive: true });
heroSlides.addEventListener('keydown', event => {
  if (event.target !== heroSlides || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  event.preventDefault();
  const change = event.key === 'ArrowLeft' ? -1 : 1;
  showHeroSlide(Math.max(0, Math.min(slideCaptions.length - 1, activeSlide + change)));
});
reduceHeroMotion.addEventListener('change', syncHeroMedia);
document.addEventListener('visibilitychange', syncHeroMedia);
new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
  syncHeroMedia();
}, { threshold: 0.15 }).observe(hero);
updateHeroSlide();

// Reveal elements on scroll
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  const revealPoint = 150;

  revealElements.forEach((el) => {
    const revealTop = el.getBoundingClientRect().top;
    if (revealTop < windowHeight - revealPoint) {
      el.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load to reveal elements already in view
revealOnScroll();

// Selected work filters
const workFilters = [...document.querySelectorAll('[data-work-filter]')];
const workCards = [...document.querySelectorAll('[data-work-category]')];
const workCount = document.querySelector('.work-count');
let workFilter = 'all';

function filterWork(category) {
  workFilter = category;
  let visible = 0;
  for (const card of workCards) {
    card.hidden = category !== 'all' && card.dataset.workCategory !== category;
    if (!card.hidden) visible++;
  }
  for (const button of workFilters) {
    button.setAttribute('aria-pressed', String(button.dataset.workFilter === category));
  }
  workCount.textContent = document.documentElement.lang === 'th'
    ? visible + ' ผลงาน'
    : visible + (visible === 1 ? ' project' : ' projects');
}

workFilters.forEach(button => {
  button.addEventListener('click', () => filterWork(button.dataset.workFilter));
});

function getHiddenWork(hash) {
  return workCards.find(card => card.hidden && '#' + card.id === hash);
}

document.addEventListener('click', event => {
  const hash = event.target.closest('a[href^="#"]')?.hash;
  const target = getHiddenWork(hash);
  if (target) filterWork(target.dataset.workCategory);
});

window.addEventListener('hashchange', () => {
  const target = getHiddenWork(location.hash);
  if (target) {
    filterWork(target.dataset.workCategory);
    target.scrollIntoView();
  }
});

filterWork(workFilter);

// Project Modal Logic
const modal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');
const projectCards = document.querySelectorAll('.project-card');

// Modal Elements
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalLinks = document.getElementById('modal-links');
const modalVideo = document.getElementById('modal-video');
const modalGallery = document.getElementById('modal-gallery');
let modalTrigger;

function showModal(trigger) {
  modalTrigger = trigger;
  modal.classList.add('show');
  modal.querySelector('.modal-content').scrollTop = 0;
  document.body.style.overflow = 'hidden';
  closeModal.focus({ preventScroll: true });
}

projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Prevent opening modal if clicking on a link directly inside the card
    if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) return;

    // Extract data from the clicked card
    const projImg = card.querySelector('.project-image');
    const titleHTML = card.querySelector('h3').innerHTML;
    const descHTML = card.querySelector('.project-desc-content')
      ? card.querySelector('.project-desc-content').innerHTML
      : card.querySelector('p').innerHTML;
    const tagsHTML = card.querySelector('.tags').innerHTML;
    
    const links = [...card.querySelectorAll('.project-link')].map(link => link.cloneNode(true));
    modalLinks.replaceChildren(...links);

    const images = card.dataset.images?.split(',') ?? [];
    renderGallery(images, card);
    modalImg.style.display = images.length ? 'none' : 'block';
    if (!images.length) {
      modalImg.style.backgroundImage = window.getComputedStyle(projImg).backgroundImage;
      modalImg.style.backgroundSize = 'cover';
      modalImg.style.backgroundPosition = 'center';
    }

    modalTitle.innerHTML = titleHTML;
    modalDesc.innerHTML = descHTML;
    modalTags.innerHTML = tagsHTML;
    const videoUrlStr = card.getAttribute('data-video');
    let localVideo;

    if (card.dataset.localVideo && modalVideo) {
      localVideo = document.createElement('video');
      localVideo.controls = true;
      localVideo.playsInline = true;
      localVideo.preload = 'metadata';
      localVideo.src = card.dataset.localVideo;
      localVideo.poster = card.dataset.videoPoster;
      const captions = document.createElement('track');
      captions.kind = 'captions';
      captions.srclang = 'en';
      captions.label = 'English';
      captions.src = card.dataset.videoCaptions;
      localVideo.append(captions);
      modalVideo.replaceChildren(localVideo);
      modalVideo.style.display = 'block';
    } else if (videoUrlStr && modalVideo) {
      const videoUrls = videoUrlStr.split(',');
      modalVideo.innerHTML = '';
      videoUrls.forEach(url => {
        modalVideo.innerHTML += `<iframe width="100%" height="315" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius: 12px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.1);"></iframe>`;
      });
      modalVideo.style.display = 'block';
    } else if (modalVideo) {
      modalVideo.innerHTML = '';
      modalVideo.style.display = 'none';
    }

    // Show modal
    showModal(card.querySelector('.project-preview') || document.activeElement);
    if (localVideo && e.target.closest('.project-preview')) {
      localVideo.play().catch(() => {
        // Keep native controls available if the browser blocks playback.
      });
    }
  });
});

const hideModal = () => {
  modal.classList.remove('show');
  modalVideo.replaceChildren();
  renderGallery([]);
  document.body.style.overflow = '';
  modalTrigger?.focus({ preventScroll: true });
};

if (closeModal) {
  closeModal.addEventListener('click', hideModal);
}

// Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    hideModal();
  }
});

// Clickable Experience Logic
const expItems = document.querySelectorAll('.clickable-experience');

expItems.forEach(item => {
  item.addEventListener('click', () => {
    const titleHTML = item.querySelector('h3').innerHTML;
    const descHTML = item.querySelector('.experience-details-wrap')
      ? item.querySelector('.experience-details-wrap').innerHTML
      : (item.querySelector('ul') ? item.querySelector('ul').outerHTML : '');

    const imagesStr = item.getAttribute('data-images');
    const images = imagesStr ? imagesStr.split(',') : [];
    const videoUrl = item.getAttribute('data-video');

    // Hide main modal image for gallery view
    modalImg.style.display = 'none';
    
    modalTitle.innerHTML = titleHTML;
    modalDesc.innerHTML = descHTML;
    modalTags.innerHTML = '';
    modalLinks.innerHTML = '';
    
    // Build Video
    if (videoUrl && modalVideo) {
      modalVideo.innerHTML = `<iframe width="100%" height="315" src="${videoUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius: 12px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.1);"></iframe>`;
      modalVideo.style.display = 'block';
    } else if (modalVideo) {
      modalVideo.innerHTML = '';
      modalVideo.style.display = 'none';
    }

    renderGallery(images, item);

    showModal(document.activeElement);
  });
});

// Fullscreen Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.getElementById('close-lightbox');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxCaption = document.getElementById('lightbox-caption');

let currentGalleryImages = [];
let currentImageIndex = 0;
let lightboxTrigger;
let lightboxPreviousOverflow;

function renderGallery(images, source) {
  const language = document.documentElement.lang;
  const visibleCaptions = new Map(
    [...(source?.querySelectorAll('figure') ?? [])].map(figure => [
      figure.querySelector('img')?.src,
      figure.querySelector('figcaption .lang-' + language)?.textContent,
    ])
  );
  currentGalleryImages = images.map((url, index) => ({
    url,
    label: visibleCaptions.get(new URL(url, location.href).href)
      ?? (language === 'th' ? 'ภาพผลงาน ' : 'Project image ') + (index + 1),
  }));
  modalGallery.replaceChildren(...currentGalleryImages.map(({url, label}, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-thumb';
    button.setAttribute('aria-label', label);
    const image = document.createElement('img');
    image.loading = index < 6 ? 'eager' : 'lazy';
    image.src = url;
    image.alt = '';
    button.append(image);
    button.addEventListener('click', () => openLightbox(index, button));
    return button;
  }));
}

function openLightbox(index, trigger) {
  currentImageIndex = index;
  lightboxTrigger = trigger;
  updateLightboxImage();
  lightboxPreviousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  lightbox.classList.add('show');
  closeLightboxBtn.focus();
  if (modal.classList.contains('show')) modal.setAttribute('aria-hidden', 'true');
}

function closeLightbox() {
  lightbox.classList.remove('show');
  modal.removeAttribute('aria-hidden');
  document.body.style.overflow = lightboxPreviousOverflow;
  lightboxTrigger?.focus({ preventScroll: true });
}

function updateLightboxImage() {
  if (currentGalleryImages.length === 0) return;
  const { url, label } = currentGalleryImages[currentImageIndex];
  lightboxImg.src = url;
  lightboxImg.alt = '';
  lightboxCaption.textContent = label;
  lightboxCounter.innerText = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
  updateLightboxImage();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  updateLightboxImage();
}

closeLightboxBtn.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextImage);
lightboxPrev.addEventListener('click', prevImage);

let swipeStart;
lightboxImg.addEventListener('touchstart', event => {
  const touch = event.touches.length === 1 ? event.touches[0] : null;
  swipeStart = touch && { x: touch.clientX, y: touch.clientY };
}, { passive: true });
lightboxImg.addEventListener('touchend', event => {
  const start = swipeStart;
  swipeStart = null;
  if (!start || event.touches.length || currentGalleryImages.length < 2) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - start.x;
  const dy = touch.clientY - start.y;
  if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy) * 1.4) return;
  if (dx < 0) nextImage();
  else prevImage();
}, { passive: true });
lightboxImg.addEventListener('touchcancel', () => { swipeStart = null; }, { passive: true });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('show')) {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'Tab') {
      const first = closeLightboxBtn;
      const last = lightboxNext;
      if (document.activeElement === (e.shiftKey ? first : last)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    }
    return;
  }

  if (!modal.classList.contains('show')) return;
  if (e.key === 'Escape') hideModal();
  if (e.key === 'Tab') {
    const focusable = [...modal.querySelectorAll('button, a[href], iframe')];
    const target = e.shiftKey ? focusable.at(-1) : focusable[0];
    const boundary = e.shiftKey ? focusable[0] : focusable.at(-1);
    if (document.activeElement === boundary) {
      e.preventDefault();
      target.focus();
    }
  }
});

initImageLibrary((images, index, trigger) => {
  currentGalleryImages = images;
  openLightbox(index, trigger);
});

const aboutPhotos = [...document.querySelectorAll('[data-about-photo]')];
aboutPhotos.forEach((button, index) => {
  button.addEventListener('click', () => {
    const language = document.documentElement.lang;
    currentGalleryImages = aboutPhotos.map(photo => ({
      url: photo.dataset.aboutPhoto,
      label: photo.querySelector('.about-photo-title.lang-' + language).textContent,
    }));
    openLightbox(index, button);
  });
});

// Initialize real-time visitor counter & presence
initVisitorCounter();
