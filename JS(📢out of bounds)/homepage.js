// document.addEventListener("DOMContentLoaded", function () {
 
// });

document.addEventListener("DOMContentLoaded", async function () {

   const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};

   // ✅ Apply liked style on load
   document.querySelectorAll(".like-btn").forEach((btn) => {
     const postId = btn.getAttribute("data-post-id");
     if (likedPosts[postId]) {
       btn.classList.add("liked");
     }
   });

   // ✅ Toggle like on click
   document.addEventListener("click", function (e) {
     if (e.target.classList.contains("like-btn")) {
       const btn = e.target;
       const postId = btn.getAttribute("data-post-id");

       btn.classList.toggle("liked");

       likedPosts[postId] = btn.classList.contains("liked");
       localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

       btn.classList.add("animate");
       setTimeout(() => btn.classList.remove("animate"), 200);
     }
   });

  function showBottomSpinner() {
    document.getElementById("loadingSpinner").style.display = "block";
  }

  function hideBottomSpinner() {
    document.getElementById("loadingSpinner").style.display = "none";
  }

  // Function to show the loading modal
  function showLoadingModal() {
    const loadingModal = document.getElementById("loadingModal");
    loadingModal.style.display = "flex"; // Show the modal
  }

  // Function to hide the loading modal
  function hideLoadingModal() {
    const loadingModal = document.getElementById("loadingModal");
    loadingModal.style.display = "none"; // Hide the modal
  }
  // Declare posts array globally
  let posts = [];

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
  // logoutButton.addEventListener("click", function () {
  //   localStorage.removeItem("token"); // Remove the token from localStorage
  //   window.location.href = "login.html"; // Redirect to the login page
  // });

  // // Handle Profile redirection
  // profileButton.addEventListener("click", function () {
  //   window.location.href = "proile.html"; // Redirect to the profile page
  // });

  let page = 1;
  const limit = 3;
  let isLoading = false;
  let hasMore = true;
  let fetchFailed = false;
  let isFirstLoad = true; // 🔥 Add this global variable

  const homepageFeed = document.getElementById("homepageFeed");
  const errorFeed = document.getElementById("errorFeed");

  // Fetch and render posts
  async function loadPosts() {
    if (isLoading || !hasMore || fetchFailed) return;
    isLoading = true;

    // ✅ Show modal only the first time
    if (isFirstLoad) {
      showLoadingModal();
    }

    try {
      const response = await fetch(
        `https://propnetix-backend-v2.onrender.com/api/posts?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts from server.");
      }

      const newPosts = await response.json();
      // console.log("Fetched page", page, newPosts);

      if (newPosts.length === 0) {
        hasMore = false;
        // hideBottomSpinner(); // 👈 hide permanently if done
        if (page === 1) {
          homepageFeed.innerHTML = "<p>No posts available.</p>";
        }
        hideLoadingModal();
        return;
      }
      errorFeed.style.display = "none";
      posts = posts.concat(newPosts); // Keep all posts for filtering
      displayPosts(newPosts, true); // Append instead of replacing
      page++;
      fetchFailed = false; // success, reset failure
      // ✅ Hide modal after first batch
      if (isFirstLoad) {
        hideLoadingModal();
        isFirstLoad = false; // 🔥 Turn off for next calls
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      fetchFailed = true;
      if (page === 1) {
        errorFeed.innerHTML =
          "<h4 style='text-align: center;'>An error occured. Check your internet connection and try again.</h4>";
      }
      hideLoadingModal();
    } finally {
      // hideBottomSpinner(); // 👈 hide on finish
      isLoading = false;
    }
  }

  loadPosts();
  // Auto-fetch posts every 8 seconds
  setInterval(() => {
    loadPosts();
  }, 10); // adjust time as needed

  // Filtering logic stays the same
  document
    .getElementById("keywordSearch")
    .addEventListener("input", function () {
      const keywordQuery = this.value.toLowerCase();
      const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(keywordQuery)
      );

      if (filteredPosts.length === 0) {
        homepageFeed.innerHTML = "<p>No matches found.</p>";
      } else {
        displayPosts(filteredPosts, false); // Reset and show filtered
      }
    });

  // Modified displayPosts to support append or replace
  function displayPosts(postsToDisplay, append = false) {
    if (!append) homepageFeed.innerHTML = "";

    postsToDisplay.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post", "animate-in");

      const postedDate = new Date(post.createdAt);
      const timeAgo = getTimeAgo(postedDate);

      let title = post.title;
      const keywordQuery = document
        .getElementById("keywordSearch")
        .value.trim()
        .toLowerCase();

      if (keywordQuery && title.toLowerCase().includes(keywordQuery)) {
        const regex = new RegExp(`(${keywordQuery})`, "gi");
        title = title.replace(regex, "<b>$1</b>");
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
       <button class="like-btn" data-post-id="${post._id}">❤</button>
        <div id="post-images">
          ${post.images
            .map(
              (img) => `
            <a href="${img}" data-lightbox="post-gallery">
              <img src="${img}" alt="Post Image" class="post-image" loading="lazy" />
            </a>`
            )
            .join("")}
        </div>

        <div class="post-content">
          <h3 class="post-title">${title}</h3>
<p class="post-description">
  ${shortText}<span class="more-text" style="display: none;">${restText}</span><span class="toggle-desc" onclick="toggleDescription(this)">See more</span>
</p>

          <div class="post-meta-top">
            <span class="post-category">
              <span class="icon-circle"><i class="fas fa-tags"></i></span>
              ${post.category}
            </span>
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
            ${post.location}
          </p>
           

           
<div class="post-top">
         
          <p class="post-phone">
  <span class="icon-circle-phone">
    <a href="tel:${post.phone}">
      <i class="fas fa-phone"></i>
    </a>
  </span>
  <a href="tel:${post.phone}" class="phone-number">
    ${post.phone}
  </a>
</p>

<span class="post-price">
              <span class="post-location">Negotiable? </span>
              <span style="color: #4aa3f0;">${post.negotiable}</span>
            </span>
          </div>

          <div class="post-meta-bottom">
            <span class="post-username">_</span>
            <span class="post-time">${timeAgo}</span>
          </div>
        </div>
      `;

        const likeBtn = postDiv.querySelector(".like-btn");
        if (likedPosts[post._id]) {
          likeBtn.classList.add("liked");
        }

      homepageFeed.appendChild(postDiv);
    });
  }

  // getTimeAgo function stays unchanged
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
});
