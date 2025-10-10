const createPostBtn = document.querySelector(".createPost_button");
const modalOverlay = document.getElementById("postModalOverlay");
const closeModal = document.getElementById("closeModal");

createPostBtn.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden"; // prevent scrolling
});

closeModal.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  document.body.style.overflow = "auto";
});

// Optional: Close when clicking outside the form
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

const imageInput = document.getElementById("images");
const fileLabel = document.getElementById("fileUploadLabel");

imageInput.addEventListener("change", function () {
  const files = Array.from(this.files);

  // --- Check for videos ---
  const hasVideo = files.some((file) => file.type.startsWith("video/"));
 if (hasVideo) {
   uploadError.textContent =
     " Videos are not allowed. Please upload only images.";
   this.value = "";
   fileLabel.textContent = "No image chosen";
   return;
 } else {
   uploadError.textContent = ""; // clear old message
 }

  // --- Check for image count limit ---
  if (files.length > 5) {
    uploadError.textContent = " You can upload a maximum of 5 images.";
    this.value = ""; // Clear selection
    fileLabel.textContent = "No image chosen";
    return; 
  }

  // --- Update label ---
  if (files.length === 0) {
    fileLabel.textContent = "No image chosen";
  } else {
    fileLabel.textContent = `${files.length} image(s) selected`;
  }
});
