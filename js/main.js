const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const zoomableImages = Array.from(document.querySelectorAll("[data-zoomable]"));

let currentImageIndex = 0;
let touchStartX = 0;

function updateHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function closeNav() {
  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function showLightboxImage(index) {
  currentImageIndex = (index + zoomableImages.length) % zoomableImages.length;
  const image = zoomableImages[currentImageIndex];
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "";
  lightboxCaption.textContent = image.alt || "";
}

function openLightbox(index) {
  showLightboxImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
  lightboxImage.src = "";
}

function showPreviousImage() {
  showLightboxImage(currentImageIndex - 1);
}

function showNextImage() {
  showLightboxImage(currentImageIndex + 1);
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

zoomableImages.forEach((image, index) => {
  image.addEventListener("click", () => openLightbox(index));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPreviousImage);
lightboxNext.addEventListener("click", showNextImage);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightbox.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;

  if (Math.abs(diff) > 48) {
    if (diff > 0) {
      showPreviousImage();
    } else {
      showNextImage();
    }
  }
}, { passive: true });

document.addEventListener("click", (event) => {
  if (!header.contains(event.target) && nav.classList.contains("is-open")) {
    closeNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeNav();
  }

  if (lightbox.classList.contains("is-open") && event.key === "ArrowLeft") {
    showPreviousImage();
  }

  if (lightbox.classList.contains("is-open") && event.key === "ArrowRight") {
    showNextImage();
  }
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();
