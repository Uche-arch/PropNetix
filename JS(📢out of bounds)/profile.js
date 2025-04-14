document.addEventListener("DOMContentLoaded", async function () {
  // Check if a user is logged in (i.e., check if there's a JWT in localStorage)
  const token = localStorage.getItem("token");

  // Get the buttons by their IDs
  const signupButton = document.getElementById("signupButton");
  const loginButton = document.getElementById("LoginButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");

  // If the token exists, the user is logged in
  if (token) {
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

  // Handle Log Out functionality
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("token"); // Remove the token from localStorage
    window.location.href = "login.html"; // Redirect to the login page
  });

  // Get the token from localStorage to authenticate the user
  // const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to view your posts.");
    return;
  }

  // Fetch user data to get username
  await fetchUserData(token);

  await fetchUserPosts(token);

  // Listen for changes to the category dropdown to show the land measurement input
  const categoryDropdown = document.getElementById("category");
  categoryDropdown.addEventListener("change", toggleLandMeasurement);
  toggleLandMeasurement(); // Initial check for category selection
});

// Fetch user data to get the username
async function fetchUserData(token) {
  const response = await fetch("http://127.0.0.1:5000/api/user", {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

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
  showLoadingModal()

  // function showTemporaryModal(modalId, duration = 2000) {
  //   const modal = document.getElementById(modalId);
  //   modal.style.display = "block";
  //   setTimeout(() => {
  //     modal.style.display = "none";
  //   }, duration);
  // }
  function showTemporaryModal(modalId, duration = 2000, reload = false) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
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
  const price = document.getElementById("price").value;
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
  formData.append("price", price);
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
    const response = await fetch("http://127.0.0.1:5000/api/create-post", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });
    // showLoadingModal();
    const data = await response.json();
    console.log("Post created data:", data);

    if (data.message === "Post created successfully!") {
      // hideLoadingModal();
      // alert("Post created successfully!");
      showTemporaryModal("postingModal", 2000, true);
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
  loadingModal.style.display = "block"; // Show the modal
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

  const response = await fetch("http://127.0.0.1:5000/api/posts/user", {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();

  if (response.ok) {
    // Hide the loading modal after data is fetched
    hideLoadingModal();
    const postFeed = document.getElementById("postFeed");
    postFeed.innerHTML = ""; // Clear existing posts

    // //Reverse the array to show the most recent posts first
    // data.reverse();

    data.forEach((post) => {
      appendPostToFeed(post, "postFeed");
    });
  } else {
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
  postDiv.classList.add("post");

  // Convert the createdAt timestamp to a readable format
  const postedDate = new Date(post.createdAt); // Assuming the backend returns a valid date
  const timeAgo = getTimeAgo(postedDate); // Get time ago format
  postDiv.innerHTML = `
    <p id="post-time">Posted ${timeAgo}</p> <!-- Display the formatted date -->
    <h3 id="post-title">${post.title}</h3>
    <p id="post-description">${post.description}</p>
    <p id="post-price">Price: ₦${post.price.toLocaleString()}</p>
    <p id="post-location">Location: ${post.location}</p>
    <p id="post-phone">Phone: ${post.phone}</p>
    <p id="post-category">Category: ${post.category}</p>
    <p id="post-negotiable">Negotiable: ${post.negotiable}</p>
    ${post.measurement ? `<p>Measurement: ${post.measurement}</p>` : ""}
    <div id="post-images">
      ${post.images
        .map((image) => `<img src="${image}" alt="Post Image" />`)
        .join("")}
    </div>
    <button class="delete-button" data-post-id="${
      post._id
    }"><i class="fa-solid fa-trash"></i>
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
  function showTemporaryModal(modalId, duration = 2000, refresh = false) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";

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
  showLoadingModal();

  try {
    const response = await fetch(
      `http://127.0.0.1:5000/api/delete-post/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );
    hideLoadingModal();

    const data = await response.json();
    if (response.ok) {
      // alert("Post deleted successfully!");
      showTemporaryModal("deleteSuccessModal", 2000, true);
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
