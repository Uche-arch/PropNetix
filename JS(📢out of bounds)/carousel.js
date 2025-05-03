const carouselOffsets = {};

function scrollCarousel(direction, postId) {
  const track = document.getElementById(`carouselTrack-${postId}`);
  const container = track.parentElement;
  const scrollWidth = container.offsetWidth;

  // Track per-post offset
  if (!carouselOffsets[postId]) {
    carouselOffsets[postId] = 0;
  }

  const maxScroll = track.scrollWidth - container.clientWidth;

  if (direction === "right") {
    carouselOffsets[postId] += scrollWidth;
    if (carouselOffsets[postId] > maxScroll) {
      carouselOffsets[postId] = maxScroll;
    }
  } else {
    carouselOffsets[postId] -= scrollWidth;
    if (carouselOffsets[postId] < 0) {
      carouselOffsets[postId] = 0;
    }
  }

  track.style.transform = `translateX(-${carouselOffsets[postId]}px)`;
}

function toggleDescription(toggleBtn) {
  const moreText = toggleBtn.previousElementSibling;
  if (moreText.style.display === "inline") {
    moreText.style.display = "none";
    toggleBtn.textContent = "See more";
  } else {
    moreText.style.display = "inline";
    toggleBtn.textContent = "See less";
  }
}
