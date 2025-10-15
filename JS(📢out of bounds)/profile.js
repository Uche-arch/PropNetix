document.addEventListener("DOMContentLoaded", async function () {
  // Show loading modal immediately
  showLoadingModal();

  const modalOverlay = document.getElementById("postModalOverlay");
  const noPostMessage = document.getElementById("noPostMessage");

  // Navbar buttons
  const signupButton = document.getElementById("signupButton");
  const loginButton = document.getElementById("LoginButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");

  // Check local token just for UI toggle
  const hasToken = localStorage.getItem("token");

  if (hasToken) {
    signupButton.style.display = "none";
    loginButton.style.display = "none";
    profileButton.style.display = "inline-block";
    logoutButton.style.display = "inline-block";
  } else {
    signupButton.style.display = "inline-block";
    loginButton.style.display = "inline-block";
    profileButton.style.display = "none";
    logoutButton.style.display = "none";
  }

  // 🔒 Logout handler
  logoutButton.addEventListener("click", async function () {
    await firebase.auth().signOut(); // sign out of Firebase
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "all.html";
  });

  // 🔥 Firebase state listener (always fires when user logs in/out)
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      hideLoadingModal();
      alert("Please log in to view your posts.");
      return;
    }

    try {
      // Force refresh token every time page loads
      const idToken = await user.getIdToken(true);
      localStorage.setItem("token", idToken);

      // Fetch profile + posts
      await fetchUserData(idToken);
      await fetchUserPosts(idToken);

      hideLoadingModal();
    } catch (err) {
      console.error("Error refreshing token:", err);
      hideLoadingModal();
      alert("Failed to load your profile. Please try again.");
    }
  });

  // Category change listener (for land measurement field)
  const categoryDropdown = document.getElementById("category");
  if (categoryDropdown) {
    categoryDropdown.addEventListener("change", toggleLandMeasurement);
    toggleLandMeasurement(); // Initial call
  }
});

// Fetch user data to get the username
async function fetchUserData(token) {
  const response = await fetch(
    "https://propnetix-backend-v2.onrender.com/api/user",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (response.ok) {
    // Display the username on the profile page
    const usernameElement = document.getElementById("username");
    if (usernameElement) {
      usernameElement.textContent = data.username; // Display the username
    }
  } else {
    alert("Failed to load user data.");
  }
}

const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  modalOverlay.style.display = "none";
  showPostingModal();

  // function showTemporaryModal(modalId, duration = 2000) {
  //   const modal = document.getElementById(modalId);
  //   modal.style.display = "block";
  //   setTimeout(() => {
  //     modal.style.display = "none";
  //   }, duration);
  // }
  function showTemporaryModal(modalId, duration = 2000, reload = false) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex";
    setTimeout(() => {
      modal.style.display = "none";
      if (reload) {
        window.location.reload(); // Refresh the page after modal hides
      }
    }, duration);
  }

  const token = localStorage.getItem("token");
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  // const price = document.getElementById("price").value;

  // Handle price formatting
  let rawPriceInput = document.getElementById("price").value;
  const match = rawPriceInput.match(/^([\d,\.]+)(.*)$/);

  let formattedPrice = rawPriceInput; // Default to raw input
  if (match) {
    let numberPart = match[1].replace(/[^0-9]/g, ""); // Clean the number
    let textPart = match[2].trim(); // Keep the text (e.g., "per year")
    if (numberPart) {
      let withCommas = Number(numberPart).toLocaleString(); // Add commas
      formattedPrice = `${withCommas}${textPart ? " " + textPart : ""}`; // Reassemble with text
    }
  }

  const location = document.getElementById("location").value;
  const phone = document.getElementById("phone").value;
  const images = document.getElementById("images").files;

  const category = document.getElementById("category").value;
  const negotiable = document.querySelector(
    'input[name="negotiable"]:checked'
  ).value;
  const measurement =
    category === "land" ? document.getElementById("measurement").value : null;

  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", formattedPrice);
  formData.append("location", location);
  formData.append("phone", phone);
  formData.append("category", category);
  formData.append("negotiable", negotiable);
  if (measurement) {
    formData.append("measurement", measurement);
  }

  // Append each selected image to the FormData object
  for (let i = 0; i < images.length; i++) {
    formData.append("images", images[i]);
  }

  try {
    const response = await fetch(
      "https://propnetix-backend-v2.onrender.com/api/create-post",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    // showLoadingModal();
    const data = await response.json();
    console.log("Post created data:", data);

    if (data.message === "Post created") {
      // hideLoadingModal();
      // alert("Post created successfully!");
      hidePostingModal();
      showTemporaryModal("postedModal", 2000, true);
      postForm.reset();
      appendPostToFeed(data.post, "postFeed");
      // updateHomepageFeed(data.post);
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error creating post:", error);
    alert("There was an error creating your post. Please try again later.");
  }
});

// Function to toggle land measurement input visibility based on category selection
function toggleLandMeasurement() {
  const category = document.getElementById("category").value;
  const landMeasurementDiv = document.getElementById("landMeasurement");

  if (category === "land") {
    landMeasurementDiv.style.display = "block";
  } else {
    landMeasurementDiv.style.display = "none";
  }
}
// Function to show the loading modal
function showLoadingModal() {
  const loadingModal = document.getElementById("loadingModal");
  loadingModal.style.display = "flex"; // Show the modal
}

function showPostingModal() {
  const postingModal = document.getElementById("postingModal");
  postingModal.style.display = "flex"; // Show the modal
}

function hidePostingModal() {
  const postingModal = document.getElementById("postingModal");
  postingModal.style.display = "none"; // Show the modal
}

function showDeletingModal() {
  const postingModal = document.getElementById("deletingModal");
  postingModal.style.display = "flex"; // Show the modal
}

function hideDeletingModal() {
  const deletingModal = document.getElementById("deletingModal");
  deletingModal.style.display = "none";
}

// Function to hide the loading modal
function hideLoadingModal() {
  const loadingModal = document.getElementById("loadingModal");
  loadingModal.style.display = "none"; // Hide the modal
}
// Function to fetch the user's posts and display them
async function fetchUserPosts(token) {
  // Show the loading modal when data is being fetched
  showLoadingModal();

  const response = await fetch(
    "https://propnetix-backend-v2.onrender.com/api/posts/user",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  const postFeed = document.getElementById("postFeed");
  const noPostMessage = document.getElementById("noPostMessage");

  if (response.ok) {
    // Hide the loading modal after data is fetched
    hideLoadingModal();
    postFeed.innerHTML = ""; // Clear existing posts

    if (data.length > 0) {
      noPostMessage.style.display = "none";
      // data.reverse(); // Uncomment if needed
      data.forEach((post) => {
        appendPostToFeed(post, "postFeed");
      });
    } else {
      noPostMessage.style.display = "block";
    }
  } else {
    hideLoadingModal();
    alert("Failed to load posts. Check internet connection.");
  }
}

// Function to calculate and return time ago format (e.g., "1 minute ago")
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date; // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

// Function to append a post to the profile feed
function appendPostToFeed(post, feedId) {
  const postFeed = document.getElementById(feedId);
  const postDiv = document.createElement("div");
  postDiv.classList.add("post", "animate-in");

  // Convert the createdAt timestamp to a readable format
  const postedDate = new Date(post.createdAt); // Assuming the backend returns a valid date
  const timeAgo = getTimeAgo(postedDate); // Get time ago format

  // Description logic
  let desc = post.description;
  let maxLength = 80;

  // Find the last space before 80 characters
  let cutoff = desc.slice(0, maxLength).lastIndexOf(" ");
  cutoff = cutoff === -1 ? maxLength : cutoff;

  let shortText = desc.slice(0, cutoff); // ends at last full word
  let restText = desc.slice(cutoff); // starts with space before next word

  postDiv.innerHTML = `
   <div id="post-images">
  ${post.images
    .map(
      (img) => `
    <a href="${img}" data-lightbox="post-gallery">
      <img src="${img}" alt="Post Image" class="post-image" loading="lazy" />
    </a>
  `
    )
    .join("")}
</div>

  <div class="post-content">
    <h3 class="post-title">${post.title}</h3>

   <p class="post-description">
  ${shortText}<span class="more-text" style="display: none;">${restText}</span><span class="toggle-desc" onclick="toggleDescription(this)">See more</span>
</p>

    <div class="post-meta-top">
  <span class="post-category">
    <span class="icon-circle"><i class="fas fa-tags"></i></span>
    ${post.category}
  </span>
  <span class="post-price">
    <span class="icon-circle"></span>
    ₦${post.price.toLocaleString()}
  </span>
</div>

${
  post.measurement
    ? `
<p class="post-measurement">
  <span class="icon-circle"><i class="fas fa-ruler-combined"></i></span>
  ${post.measurement}m²
</p>`
    : ""
}

<p class="post-location">
  <span class="icon-circle"><i class="fas fa-map-marker-alt"></i></span>
  ${post.location}
</p>

<div class="post-top">
          <p class="post-phone">
            <span class="icon-circle"><i class="fas fa-phone"></i></span>
            ${post.phone}
          </p>
<span class="post-price">
              <span class="post-location">Negotiable? </span>
              <span style="color: #4aa3f0;">${post.negotiable}</span>
            </span>
          </div>


    <div class="post-meta-bottom">
      <span class="post-time">${timeAgo}</span>
    </div>
  </div>
    <button class="delete-button" data-post-id="${post._id}">
Delete</button>
  `;

  postFeed.append(postDiv);

  const deleteButton = postDiv.querySelector(".delete-button");
  deleteButton.addEventListener("click", async () => {
    await deletePost(post._id);
  });
}

// Function to delete a post
async function deletePost(postId) {
  // function showTemporaryModal(modalId, duration = 2000) {
  //   const modal = document.getElementById(modalId);
  //   modal.style.display = "block";
  //   setTimeout(() => {
  //     modal.style.display = "none";
  //   }, duration);
  // }
  function showTemporaryModal(modalId, duration = 2500, refresh = false) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex";

    setTimeout(() => {
      modal.style.display = "none";
      if (refresh) {
        window.location.reload(); // Refresh the page
      }
    }, duration);
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to delete a post.");
    return;
  }
  showDeletingModal();

  try {
    const response = await fetch(
      `https://propnetix-backend-v2.onrender.com/api/delete-post/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    hideLoadingModal();

    const data = await response.json();
    if (response.ok) {
      // alert("Post deleted successfully!");
      hideDeletingModal(); // ✅ Add this here
      showTemporaryModal("deleteSuccessModal", 2500, true);
      const postDiv = document.querySelector(`.post[data-post-id="${postId}"]`);
      if (postDiv) {
        postDiv.remove();
      }
    } else {
      alert("Error deleting post: " + data.message);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("There was an error deleting your post. Please try again later.");
  }
}
