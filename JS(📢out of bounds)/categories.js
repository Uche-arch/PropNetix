document.addEventListener("DOMContentLoaded", async function () {
  // Check if a user is logged in (i.e., check if there's a JWT in localStorage)
  const token = localStorage.getItem("token");

  // Get the buttons by their IDs
  const signupButton = document.getElementById("signupButton");
  const loginButton = document.getElementById("LoginButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");

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

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  // Get the category from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  if (!category) {
    alert("Category not found.");
    return;
  }

  const categoryTitle = document.getElementById("categoryTitle");
  if (categoryTitle) {
    categoryTitle.innerText = `Posts in ${
      category.charAt(0).toUpperCase() + category.slice(1)
    }`;
  }

  const postsContainer = document.getElementById("postsContainer");
  const locationSearchInput = document.getElementById("locationSearch");
  const priceSearchInput = document.getElementById("priceSearch");

  // Pagination state
  let page = 1;
  const limit = 3; // adjust as needed
  let posts = [];
  let loading = false;
  let noMorePosts = false;
  let fetchFailed = false;

  function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
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

  function displayPosts(postsToDisplay, append = false) {
    if (!append) {
      postsContainer.innerHTML = "";
    }
    postsToDisplay.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post", "animate-in");

      const createdAt = new Date(post.createdAt);
      const timeAgo = getTimeAgo(createdAt);

      let locationText = post.location;
      const locationQuery = locationSearchInput.value.toLowerCase();
      if (locationQuery && locationText.toLowerCase().includes(locationQuery)) {
        const regex = new RegExp(locationQuery, "gi");
        locationText = locationText.replace(
          regex,
          (match) => `<b>${match}</b>`
        );
      }

      let priceText = post.price;
      const priceQuery = priceSearchInput.value;
      if (priceQuery) {
        const priceRegex = new RegExp(priceQuery, "g");
        priceText = priceText
          .toString()
          .replace(priceRegex, (match) => `<b>${match}</b>`);
      }

      let username = post.user?.username || "Unknown User";

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
            <span class="post-price">
              <span class="icon-circle"><i class="fas fa-money-bill"></i></span>
              ₦${post.price.toLocaleString()}
            </span>
          </div>

          ${
            post.measurement
              ? `<p class="post-measurement">
                  <span class="icon-circle"><i class="fas fa-ruler-combined"></i></span>
                  ${post.measurement}m²
                </p>`
              : ""
          }

          <p class="post-location">
            <span class="icon-circle"><i class="fas fa-map-marker-alt"></i></span>
            ${locationText}
          </p>

          <p class="post-phone">
            <span class="icon-circle"><i class="fas fa-phone"></i></span>
            ${post.phone}
          </p>

          <div class="post-meta-bottom">
            <span class="post-username">Posted by: ${username}</span>
            <span class="post-time">${timeAgo}</span>
          </div>
        </div>
      `;

      postsContainer.appendChild(postDiv);
    });
  }

  async function loadPosts() {
    if (loading || noMorePosts || fetchFailed) return;
    loading = true;
    showBottomSpinner();

    try {
      const response = await fetch(
        `https://propnetix-backend-v2.onrender.com/api/posts?category=${category}&page=${page}&limit=${limit}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts from server.");
      }

      const newPosts = await response.json();

      if (newPosts.length === 0) {
        noMorePosts = true;
        hideBottomSpinner();
        if (page === 1) {
          postsContainer.innerHTML = "<p>No posts available.</p>";
        }
        return;
      }

      posts = posts.concat(newPosts); // Keep all posts for filtering
      displayPosts(newPosts, true); // Append instead of replacing

      page++;
      fetchFailed = false; // success, reset failure
    } catch (error) {
      console.error("Error loading posts:", error);
      fetchFailed = true;
      hideBottomSpinner();
      if (page === 1) {
        postsContainer.innerHTML =
          "<p>There was an error loading posts. Check your internet connection and try again.</p>";
      }
    } finally {
      loading = false;
      if (!noMorePosts) {
        hideBottomSpinner();
      }
    }
  }

  // Initial load
  await loadPosts();


// Interval to add more posts
  setInterval(() => {
    if (!loading && !noMorePosts && !fetchFailed) {
      loadPosts();
    }
  }, 1000); // Loads posts every 2 seconds
  // Search filters

  locationSearchInput.addEventListener("input", () => {
    const locationQuery = locationSearchInput.value.toLowerCase();
    const filteredPosts = posts.filter((post) =>
      post.location.toLowerCase().includes(locationQuery)
    );
    if (filteredPosts.length === 0) {
      postsContainer.innerHTML = "<p>No matches found.</p>";
    } else {
      displayPosts(filteredPosts);
    }
  });

  priceSearchInput.addEventListener("input", () => {
    const priceQuery = priceSearchInput.value;
    const filteredPosts = posts.filter((post) =>
      post.price.toString().includes(priceQuery)
    );
    if (filteredPosts.length === 0) {
      postsContainer.innerHTML = "<p>No matches found.</p>";
    } else {
      displayPosts(filteredPosts);
    }
  });
});

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

function showBottomSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
}

function hideBottomSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}
