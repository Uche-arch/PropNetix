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

const fileInput = document.getElementById("images");
const fileLabel = document.getElementById("fileUploadLabel");

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    fileLabel.textContent = `${fileInput.files.length} file(s) selected`;
  } else {
    fileLabel.textContent = "No files chosen";
  }
});

