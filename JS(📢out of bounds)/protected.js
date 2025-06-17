// protect.js

document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true" || isLoggedIn == "false") {
    showAuthModal();
  }

  function showAuthModal() {
    const overlay = document.createElement("div");
    overlay.id = "auth-overlay";
    overlay.innerHTML = `
      <div class="auth-modal">
        <h2>Access Denied</h2>
        <p>You must log in or sign up to view this page.</p>
        <div class="auth-buttons">
          <button onclick="window.location.href='login.html'">Log In</button>
          <button onclick="window.location.href='signup.html'">Sign Up</button>
          <a href="#" id="guest-btn" style="display: block; margin-top: 1rem; color: #6c757d; text-decoration: underline; cursor: pointer;">
            Continue as Guest
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Clicking Continue as Guest just closes the modal for this page only
    document
      .getElementById("guest-btn")
      .addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("auth-overlay").remove();
      });
  }
});
