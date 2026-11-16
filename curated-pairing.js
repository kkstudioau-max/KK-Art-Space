const galleryToggle = document.querySelector(".photo-gallery-toggle");
const photoGallery = document.querySelector("#photo-gallery");
const photos = Array.from(document.querySelectorAll(".pairing-photo"));
let activePhotoIndex = 0;
let zoomLevel = 1;
let touchStartX = 0;
let touchStartY = 0;

if (galleryToggle && photoGallery) {
  galleryToggle.addEventListener("click", () => {
    const isExpanded = galleryToggle.getAttribute("aria-expanded") === "true";
    galleryToggle.setAttribute("aria-expanded", String(!isExpanded));
    galleryToggle.textContent = isExpanded ? "View Additional Photos" : "Hide Additional Photos";
    photoGallery.hidden = isExpanded;
  });
}

function updateLightbox() {
  const photo = photos[activePhotoIndex];
  const viewer = document.querySelector(".image-viewer");
  const fullSizeImage = viewer.querySelector(".image-viewer-photo");
  fullSizeImage.src = photo.currentSrc || photo.src;
  fullSizeImage.alt = photo.alt;
  fullSizeImage.style.transform = "scale(1)";
  fullSizeImage.classList.remove("is-zoomed");
  zoomLevel = 1;
  viewer.querySelector(".image-viewer-count").textContent = `${activePhotoIndex + 1} / ${photos.length}`;
}

function showPhoto(index) {
  activePhotoIndex = (index + photos.length) % photos.length;
  updateLightbox();
}

function setZoom(level) {
  zoomLevel = Math.min(3, Math.max(1, level));
  const image = document.querySelector(".image-viewer-photo");
  image.style.transform = `scale(${zoomLevel})`;
  image.classList.toggle("is-zoomed", zoomLevel > 1);
}

function openLightbox(index) {
  let viewer = document.querySelector(".image-viewer");
  if (!viewer) {
    viewer = document.createElement("dialog");
    viewer.className = "image-viewer";
    viewer.setAttribute("aria-label", "Full-size artwork photographs");

    const fullSizeImage = document.createElement("img");
    fullSizeImage.className = "image-viewer-photo";

    const makeButton = (className, label, text, action) => {
      const button = document.createElement("button");
      button.className = `image-viewer-control ${className}`;
      button.type = "button";
      button.setAttribute("aria-label", label);
      button.textContent = text;
      button.addEventListener("click", action);
      return button;
    };

    const closeButton = document.createElement("button");
    closeButton.className = "image-viewer-close";
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close full-size image");
    closeButton.addEventListener("click", () => viewer.close());

    const count = document.createElement("span");
    count.className = "image-viewer-count";
    count.setAttribute("aria-live", "polite");

    viewer.append(
      fullSizeImage,
      makeButton("image-viewer-previous", "Previous photograph", "‹", () => showPhoto(activePhotoIndex - 1)),
      makeButton("image-viewer-next", "Next photograph", "›", () => showPhoto(activePhotoIndex + 1)),
      makeButton("image-viewer-zoom-out", "Zoom out", "−", () => setZoom(zoomLevel - 0.25)),
      makeButton("image-viewer-zoom-in", "Zoom in", "+", () => setZoom(zoomLevel + 0.25)),
      makeButton("image-viewer-zoom-reset", "Reset zoom", "Reset", () => setZoom(1)),
      count,
      closeButton
    );

    fullSizeImage.addEventListener("click", () => setZoom(zoomLevel === 1 ? 1.5 : 1));
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) viewer.close();
    });
    viewer.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPhoto(activePhotoIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showPhoto(activePhotoIndex + 1);
      }
    });
    fullSizeImage.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });
    fullSizeImage.addEventListener("touchend", (event) => {
      if (zoomLevel > 1) return;
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        showPhoto(activePhotoIndex + (deltaX < 0 ? 1 : -1));
      }
    }, { passive: true });

    document.body.append(viewer);
  }

  showPhoto(index);
  viewer.showModal();
}

document.addEventListener("click", (event) => {
  const photo = event.target.closest?.(".pairing-photo")
    || event.target.closest?.(".photo-thumbnail")?.querySelector(".pairing-photo");
  if (!photo) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openLightbox(photos.indexOf(photo));
}, true);
