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

  if (files.length > 5) {
    alert("You can upload a maximum of 5 images.");
    this.value = ""; // Clear selection
    fileLabel.textContent = "No image chosen";
    return;
  }

  if (files.length === 0) {
    fileLabel.textContent = "No image chosen";
  } else {
    fileLabel.textContent = `${files.length} image(s) selected`;
  }
});
