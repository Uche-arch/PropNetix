document.addEventListener("DOMContentLoaded", async function () {
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
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("token"); // Remove the token from localStorage
    window.location.href = "login.html"; // Redirect to the login page
  });

  // Handle Profile redirection
  profileButton.addEventListener("click", function () {
    window.location.href = "profile.html"; // Redirect to the profile page
  });

  // Show the loading modal when data is being fetched
  showLoadingModal();
  const page = 1; // Example: you can dynamically change the page number based on user interaction
  const limit = 10; // Example: limit the number of posts per request

  // Fetch posts from the backend to display on the homepage
  try {
    const response = await fetch(
      `https://propnetixbackend.onrender.com/api/posts?page=${page}&limit=${limit}`,
      {
        method: "GET", // GET request to fetch posts
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts from server.");
    }

    posts = await response.json();
    // Log posts to make sure they're being fetched
    console.log(posts);

    // If no posts are returned, display a message
    const homepageFeed = document.getElementById("homepageFeed");
    if (posts.length === 0) {
      homepageFeed.innerHTML = "<p>No posts available.</p>";
      return;
    }

    // Hide the loading modal after data is fetched
    hideLoadingModal();

    // Display all posts initially
    displayPosts(posts);

    // Listen for price and keyword search inputs
    // document
    //   .getElementById("priceSearch")
    //   .addEventListener("input", filterPosts);
    document
      .getElementById("keywordSearch")
      .addEventListener("input", filterPosts);
    // document
    //   .getElementById("userSearch")
    //   .addEventListener("input", filterPosts);

    // Function to filter posts based on price and keyword
    // function filterPosts() {
    //   // const priceQuery = document.getElementById("priceSearch").value;
    //   const keywordQuery = document
    //     .getElementById("keywordSearch")
    //     .value.toLowerCase();

    //   // Filter the posts based on price and keyword
    //   const filteredPosts = posts.filter((post) => {
    //     // const matchesPrice = priceQuery ? post.price <= priceQuery : true;
    //     const matchesKeyword = post.title.toLowerCase().includes(keywordQuery);
    //     return matchesKeyword;
    //   });

    //   // Check if no matches are found
    //   const homepageFeed = document.getElementById("homepageFeed");
    //   if (filteredPosts.length === 0) {
    //     homepageFeed.innerHTML = "<p>No matches found.</p>"; // Show no matches found message
    //   } else {
    //     // Display the filtered posts
    //     displayPosts(filteredPosts);
    //   }
    // }

    function filterPosts() {
      const keywordQuery = document
        .getElementById("keywordSearch")
        .value.toLowerCase();
      //   const userQuery = document
      //     .getElementById("userSearch")
      //     .value.toLowerCase();

      const filteredPosts = posts.filter((post) => {
        const matchesKeyword = post.title.toLowerCase().includes(keywordQuery);
        // const matchesUser = post.user.username
        //   .toLowerCase()
        //   .includes(userQuery);
        return matchesKeyword;
      });

      const homepageFeed = document.getElementById("homepageFeed");
      if (filteredPosts.length === 0) {
        homepageFeed.innerHTML = "<p>No matches found.</p>";
      } else {
        displayPosts(filteredPosts);
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

    // Function to display posts in the feed
    function displayPosts(postsToDisplay) {
      homepageFeed.innerHTML = ""; // Clear the previous posts

      postsToDisplay.forEach((post) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // Convert the createdAt timestamp to a readable format
        const postedDate = new Date(post.createdAt); // Assuming the backend returns a valid date
        const timeAgo = getTimeAgo(postedDate); // Get time ago format

        // let title = post.title;
        // const keywordQuery = document
        //   .getElementById("keywordSearch")
        //   .value.toLowerCase();
        // if (keywordQuery) {
        //   title = title.replace(
        //     new RegExp(keywordQuery, "gi"),
        //     (match) => `<b>${match}</b>`
        //   );
        // }

        let title = post.title;
        const keywordQuery = document
          .getElementById("keywordSearch")
          .value.trim()
          .toLowerCase();

        if (keywordQuery && title.toLowerCase().includes(keywordQuery)) {
          const regex = new RegExp(`(${keywordQuery})`, "gi");
          title = title.replace(regex, "<b>$1</b>");
        }

        // Highlight username match
        let username = post.user.username;
        // if (userQuery) {
        //   username = username.replace(
        //     new RegExp(userQuery, "gi"),
        //     (match) => `<b>${match}</b>`
        //   );
        // }

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

        homepageFeed.appendChild(postDiv); // Append the post to the homepage feed
      });
    }
    // <p class="post-username">Posted by: ${
    //         post.user.username
    //       }</p> <!-- Display username -->
    // function showTemporaryModal(modalId, message = "", duration = 2000) {
    //   const modal = document.getElementById(modalId);
    //   const modalMessage = document.getElementById("errorMessage");

    //   if (modalMessage && message) {
    //     modalMessage.textContent = message;
    //   }

    //   modal.style.display = "block";

    //   setTimeout(() => {
    //     modal.style.display = "none";
    //   }, duration);
    // }
  } catch (error) {
    // hideLoadingModal();
    console.error("Error loading posts:", error);
    let load = document.getElementById("loading");
    load.innerHTML =
      "There was an error loading post, check internet connection and try again!";
    // hideLoadingModal()

    // alert("There was an error loading posts. Check internet connection.");
    // showTemporaryModal("errorModal", 'Error loading posts', 3000);
  }
});
