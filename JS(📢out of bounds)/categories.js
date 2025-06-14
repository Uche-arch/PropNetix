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
  // Get the category from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category"); // category=land, category=vehicles, etc.

  if (!category) {
    alert("Category not found.");
    return;
  }

  // Get the category name from the URL and display it
  const categoryTitle = document.getElementById("categoryTitle");
  if (categoryTitle) {
    categoryTitle.innerText = `Posts in ${
      category.charAt(0).toUpperCase() + category.slice(1)
    }`;
  }

  // Show the loading modal when data is being fetched
  showLoadingModal();

  // Fetch posts for the specific category from the backend
  try {
    const response = await fetch(
      `https://propnetixbackend.onrender.com/api/posts?category=${category}`,
      {
        method: "GET", // GET request to fetch posts
      }
    );

    if (!response.ok) {
      const errorMessage = await response.json(); // Get the error message from the response
      throw new Error(
        errorMessage.message || "Failed to fetch posts from server."
      );
    }

    let posts = await response.json();

    // Get the container where posts will be displayed
    const postsContainer = document.getElementById("postsContainer");
    const locationSearchInput = document.getElementById("locationSearch");
    const priceSearchInput = document.getElementById("priceSearch");

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

    // Function to display posts in the feed
    function displayPosts(postsToDisplay) {
      postsContainer.innerHTML = ""; // Clear the previous posts

      postsToDisplay.forEach((post) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // Format the createdAt date into a more readable format (e.g., "April 7, 2025")
        const createdAt = new Date(post.createdAt); // Convert createdAt from string to Date object
        // const formattedDate = createdAt.toLocaleDateString(); // You can customize the format
        const timeAgo = getTimeAgo(createdAt); // Get time ago format

        // Highlight the location in the description
        let locationText = post.location;
        const locationQuery = locationSearchInput.value.toLowerCase();

        if (
          locationQuery &&
          locationText.toLowerCase().includes(locationQuery)
        ) {
          const regex = new RegExp(locationQuery, "gi"); // Create a case-insensitive regex
          locationText = locationText.replace(
            regex,
            (match) => `<b>${match}</b>`
          ); // Highlight matches in bold
        }

        // Highlight the price in the description
        let priceText = post.price;
        const priceQuery = priceSearchInput.value;

        // Username
        // let username = post.user.username;
        let username = post.user?.username || "Unknown User";


        if (priceQuery) {
          const priceRegex = new RegExp(priceQuery, "g"); // Create regex for price query
          priceText = priceText
            .toString()
            .replace(priceRegex, (match) => `<b>${match}</b>`); // Highlight price matches in bold
        }

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
      ${post.description.slice(0, 80)}...
      <span class="more-text" style="display: none;">${post.description.slice(
        80
      )}</span>
      <span class="toggle-desc" onclick="toggleDescription(this)">See more</span>
    </p>

    <div class="post-meta-top">
  <span class="post-price">
    <span class="icon-circle"><i class="fas fa-money-bill"></i></span>
    ₦${post.price.toLocaleString()}
  </span>
</div>

${
  post.measurement
    ? `
<p class="post-measurement">
  <span class="icon-circle"><i class="fas fa-ruler-combined"></i></span>
  ${post.measurement}
</p>`
    : ""
}

<p class="post-location">
  <span class="icon-circle"><i class="fas fa-map-marker-alt"></i></span>
  ${post.location}
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

        postsContainer.appendChild(postDiv); // Append the post to the posts container
      });
    }

    // Hide the loading modal after data is fetched
    hideLoadingModal();

    // Display all posts initially
    displayPosts(posts);

    // Listen for changes in the location search input
    locationSearchInput.addEventListener("input", function () {
      const locationQuery = locationSearchInput.value.toLowerCase();

      // Filter the posts based on location
      const filteredPosts = posts.filter((post) => {
        return post.location.toLowerCase().includes(locationQuery);
      });

      // Check if no matches are found
      const postsContainer = document.getElementById("postsContainer");
      if (filteredPosts.length === 0) {
        postsContainer.innerHTML = "<p>No matches found.</p>"; // Show no matches found message
      } else {
        // Display the filtered posts
        displayPosts(filteredPosts);
      }

      // // Display the filtered posts
      // displayPosts(filteredPosts);
    });

    // Listen for changes in the price search input
    priceSearchInput.addEventListener("input", function () {
      const priceQuery = priceSearchInput.value;

      // Filter the posts based on price
      const filteredPosts = posts.filter((post) => {
        return post.price.toString().includes(priceQuery);
      });

      // Check if no matches are found
      if (filteredPosts.length === 0) {
        postsContainer.innerHTML = "<p>No matches found.</p>"; // Show no matches found message
      } else {
        // Display the filtered posts
        displayPosts(filteredPosts);
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    // // Display a message on the page instead of showing an alert
    // const postsContainer = document.getElementById("postsContainer");
    // if (postsContainer) {
    //   postsContainer.innerHTML = `<p>No posts available in this category for now.</p>`;
    // }
    let load = document.getElementById("loading");
    load.innerHTML =
      "There was an error loading post, check internet connection and try again!";
  }
});
