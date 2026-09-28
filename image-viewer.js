document.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLImageElement)) return;

  const image = event.target;
  const link = image.closest("a");

  // Let modified clicks keep their normal browser behavior.
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

  if (link) {
  event.preventDefault();
  window.location.assign(link.href);
  return;
}

  let viewer = document.querySelector(".image-viewer");

  if (!viewer) {
    viewer = document.createElement("dialog");
    viewer.className = "image-viewer";
    viewer.setAttribute("aria-label", "Full-size artwork image");

    const fullSizeImage = document.createElement("img");
    const closeButton = document.createElement("button");
    closeButton.className = "image-viewer-close";
    closeButton.type = "button";
    closeButton.textContent = "Close";
    closeButton.setAttribute("aria-label", "Close full-size image");

    closeButton.addEventListener("click", () => viewer.close());
    viewer.addEventListener("click", (dialogEvent) => {
      if (dialogEvent.target === viewer) viewer.close();
    });

    viewer.append(fullSizeImage, closeButton);
    document.body.append(viewer);
  }

  const fullSizeImage = viewer.querySelector("img");
  fullSizeImage.src = image.currentSrc || image.src;
  fullSizeImage.alt = image.alt;
  viewer.showModal();
});
