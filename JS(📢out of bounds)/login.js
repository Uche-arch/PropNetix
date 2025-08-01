const auth = firebase.auth();

// 📦 Modal Elements
const resendVerificationBtn = document.getElementById("resendVerificationBtn");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const userModal = document.getElementById("userModal");
const modalMessage = document.getElementById("modalMessage");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginButton = document.getElementById("loginButton");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;

  const icon = togglePassword.querySelector("i");
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
});

// 📢 Utility: Show user feedback modal
function showUserModal(message, redirectAfter = null, delay = 2900) {
  modalMessage.textContent = message;
  userModal.style.display = "flex";

  setTimeout(() => {
    userModal.style.display = "none";
    if (redirectAfter) window.location.href = redirectAfter;
  }, delay);
}

// 🔁 Utility: Show forgot password modal
function showForgotPasswordModal() {
  forgotPasswordModal.style.display = "flex";
}

// ❌ Utility: Close forgot password modal
function closeForgotPasswordModal() {
  forgotPasswordModal.style.display = "none";
}

// 🟩 LOGIN SUBMIT HANDLER
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  loginButton.textContent= "Loading..."

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 1. Attempt sign-in
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    // 2. Check email verification
    await user.reload(); // refreshes user's data from Firebase
    if (!user.emailVerified) {
      showUserModal(
        "⚠️ Your email isn’t verified yet. Please check your inbox or spam folder and verify to continue.",
        null,
        3800
      );
      await auth.signOut();

      // Enable resend button and store user in temp
      resendVerificationBtn.style.display = "block";
      window.tempUserForResend = user;
      return;
    }

    // 3. Get ID token and proceed
    const idToken = await user.getIdToken();
    localStorage.setItem("token", idToken);

    showUserModal("You’ve successfully logged in.", "profile.html");
    // Validate user login here (this is just simulated)
    localStorage.setItem("isLoggedIn", "true");
  } catch (error) {
    console.error("Login error:", error);
    showUserModal("Login failed: User not found!", null, 3000);
  loginButton.textContent = "Login";
    
  }
});

// 🔁 RESEND EMAIL VERIFICATION
resendVerificationBtn.addEventListener("click", async () => {
  const user = window.tempUserForResend;

  if (!user) {
    showUserModal("⚠️ Please try logging in first.");
    resendVerificationBtn.style.display = "none";
    return;
  }

  try {
    await user.sendEmailVerification();
    showUserModal(
      "Verification email sent. Please check your inbox or spam folder to verify.",
      null,
      6000
    );
    resendVerificationBtn.style.display = "none";
  } catch (error) {
    console.error("Resend verification error:", error);
    showUserModal("❌ Error sending email: " + error.message, null, 10000);
  }
});

// 🔑 FORGOT PASSWORD LINK HANDLER
document.getElementById("forgotPasswordLink").addEventListener("click", () => {
  showForgotPasswordModal();
});

// 📧 SEND RESET EMAIL
document
  .getElementById("sendResetEmail")
  .addEventListener("click", async () => {
    const email = document.getElementById("resetEmail").value.trim();

    if (!email) {
      showUserModal("Please enter your email.");
      return;
    }

    try {
      await auth.sendPasswordResetEmail(email);
      showUserModal(
        "A fresh verification link has been emailed to you. Please check your inbox or spam folder to verify.",
        null,
        6000
      );
      closeForgotPasswordModal();
    } catch (error) {
      console.error("Password reset error:", error);
      showUserModal("❌ Error: " + error.message);
    }
  });

// 🧼 CLOSE MODALS ON BACKDROP CLICK
window.onclick = function (event) {
  if (event.target === userModal) userModal.style.display = "none";
  if (event.target === forgotPasswordModal)
    forgotPasswordModal.style.display = "none";
};
