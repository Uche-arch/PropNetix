document.addEventListener("DOMContentLoaded", async () => {
  // DOM elements
  const signupButton = document.getElementById("signupButton");
  const loginButton = document.getElementById("LoginButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");

  // Firebase auth state
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // Only allow verified emails
      if (!user.emailVerified) {
        await auth.signOut();
        localStorage.clear();
        window.location.href = "login.html";
        return;
      }

      // Show logged-in UI
      signupButton.style.display = "none";
      loginButton.style.display = "none";
      profileButton.style.display = "inline-block";
      logoutButton.style.display = "inline-block";

      // Refresh token and save it
      const idToken = await user.getIdToken(true);
      localStorage.setItem("token", idToken);
      localStorage.setItem("isLoggedIn", "true");

      // Fetch profile and posts
      if (typeof fetchUserData === "function") await fetchUserData(idToken);
      if (typeof fetchUserPosts === "function") await fetchUserPosts(idToken);
    } else {
      // Show logged-out UI
      signupButton.style.display = "inline-block";
      loginButton.style.display = "inline-block";
      profileButton.style.display = "none";
      logoutButton.style.display = "none";

      localStorage.clear();
      // Only redirect if on a protected page
      if (
        !window.location.href.includes("login.html") &&
        !window.location.href.includes("signup.html")
      ) {
        window.location.href = "login.html";
      }
    }
  });

  // Logout
  logoutButton.addEventListener("click", async () => {
    await auth.signOut();
    localStorage.clear();
    window.location.href = "all.html";
  });

  // Auto-refresh token every 30 mins
  setInterval(async () => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(true);
      localStorage.setItem("token", idToken);
    }
  }, 30 * 60 * 1000); // 30 minutes
});
