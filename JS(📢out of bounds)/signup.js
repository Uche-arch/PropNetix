
const auth = firebase.auth();

// 📦 DOM Elements
const signupForm = document.getElementById("signupForm");
const userModal = document.getElementById("userModal");
const modalMessage = document.getElementById("modalMessage");

// 📢 Utility: Show modal message and optionally redirect
function showModalMessage(message, redirectUrl = null, delay = 2000) {
  modalMessage.textContent = message;
  userModal.style.display = "flex"; // or "block" based on your modal CSS

  setTimeout(() => {
    userModal.style.display = "none";
    if (redirectUrl) window.location.href = redirectUrl;
  }, delay);
}

// ✍️ Signup Form Submission Handler
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 📥 Grab user inputs
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // ✅ Step 1: Check username availability from backend
    const checkResponse = await fetch(
      `http://localhost:5000/api/check-username?username=${encodeURIComponent(
        username
      )}`
    );
    const checkResult = await checkResponse.json();

    if (!checkResponse.ok || !checkResult.available) {
      showModalMessage(
        "❌ Username already taken or unavailable. Please choose another."
      );
      return;
    }

    // ✅ Step 2: Create Firebase user
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    // ✅ Step 3: Send email verification
    await user.sendEmailVerification();

    // ✅ Step 4: Get Firebase ID token for auth with backend
    const token = await user.getIdToken();

    // ✅ Step 5: Send username to backend to save in MongoDB
    const saveResponse = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    const saveResult = await saveResponse.json();

    // ✅ Step 6: Final feedback to user
    if (
      saveResponse.ok &&
      saveResult.message === "User registered successfully"
    ) {
      showModalMessage(
        "✅ Verification email sent! Please verify before logging in.",
        "login.html",
        9000
      );
    } else {
      showModalMessage(
        "⚠️ Verification email sent, but backend failed: " + saveResult.message
      );
    }
  } catch (error) {
    console.error("Signup failed:", error);
    showModalMessage("❌ Signup failed: " + (error.message || "Unknown error"));
  }
});
