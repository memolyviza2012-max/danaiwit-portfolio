// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

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

projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Prevent opening modal if clicking on a link directly inside the card
    if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) return;

    // Extract data from the clicked card
    const projImg = card.querySelector('.project-image');
    const title = card.querySelector('h3').innerText;
    const descHTML = card.querySelector('p').innerHTML;
    const tagsHTML = card.querySelector('.tags').innerHTML;
    
    // Extract links
    const links = card.querySelectorAll('.project-link');
    let linksHTML = '';
    links.forEach(link => {
      // Add standard link format inside modal
      linksHTML += `<a href="${link.href}" target="_blank">${link.innerText}</a>`;
    });

    // Check for images gallery
    const imagesStr = card.getAttribute('data-images');
    const modalGallery = document.getElementById('modal-gallery');
    
    if (imagesStr && modalGallery) {
      const images = imagesStr.split(',');
      modalImg.style.display = 'none'; // hide single background image
      modalGallery.innerHTML = '';
      currentGalleryImages = images; // Store for lightbox
      images.forEach((imgUrl, index) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = 'Project Gallery Image';
        img.addEventListener('click', () => {
          openLightbox(index);
        });
        modalGallery.appendChild(img);
      });
    } else {
      // Standard single image project
      const computedBg = window.getComputedStyle(projImg).backgroundImage;
      modalImg.style.display = 'block';
      modalImg.style.backgroundImage = computedBg;
      modalImg.style.backgroundSize = 'cover';
      modalImg.style.backgroundPosition = 'center';
      if (modalGallery) modalGallery.innerHTML = '';
    }

    modalTitle.innerText = title;
    modalDesc.innerHTML = descHTML;
    modalTags.innerHTML = tagsHTML;
    modalLinks.innerHTML = linksHTML;

    const modalVideo = document.getElementById('modal-video');
    const videoUrlStr = card.getAttribute('data-video');
    
    if (videoUrlStr && modalVideo) {
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
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
});

const hideModal = () => {
  modal.classList.remove('show');
  document.body.style.overflow = 'auto'; // Restore scrolling
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
const modalGallery = document.getElementById('modal-gallery');

expItems.forEach(item => {
  item.addEventListener('click', () => {
    const title = item.querySelector('h3').innerText;
    const descHTML = item.querySelector('ul').outerHTML;
    
    const imagesStr = item.getAttribute('data-images');
    const images = imagesStr ? imagesStr.split(',') : [];
    const videoUrl = item.getAttribute('data-video');
    const modalVideo = document.getElementById('modal-video');

    // Hide main modal image for gallery view
    modalImg.style.display = 'none';
    
    modalTitle.innerText = title;
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

    // Build Gallery
    modalGallery.innerHTML = '';
    currentGalleryImages = images; // Store for lightbox
    images.forEach((imgUrl, index) => {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = 'Experience Gallery Image';
      img.addEventListener('click', () => {
        openLightbox(index);
      });
      modalGallery.appendChild(img);
    });

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

// Fullscreen Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.getElementById('close-lightbox');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

let currentGalleryImages = [];
let currentImageIndex = 0;

function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxImage();
  lightbox.classList.add('show');
}

function closeLightbox() {
  lightbox.classList.remove('show');
}

function updateLightboxImage() {
  if (currentGalleryImages.length === 0) return;
  lightboxImg.src = currentGalleryImages[currentImageIndex];
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
  }
});

