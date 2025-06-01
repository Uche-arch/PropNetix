const auth = firebase.auth();

// 📦 Modal Elements
const resendVerificationBtn = document.getElementById("resendVerificationBtn");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const userModal = document.getElementById("userModal");
const modalMessage = document.getElementById("modalMessage");

// 📢 Utility: Show user feedback modal
function showUserModal(message, redirectAfter = null, delay = 2500) {
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
    if (!user.emailVerified) {
      showUserModal("⚠️ Please verify your email before logging in.", null, 3000);
      await auth.signOut();

      // Enable resend button and store user in temp
      resendVerificationBtn.style.display = "block";
      window.tempUserForResend = user;
      return;
    }

    // 3. Get ID token and proceed
    const idToken = await user.getIdToken();
    localStorage.setItem("token", idToken);

    showUserModal("✅ Login successful!", "profile.html");
  } catch (error) {
    console.error("Login error:", error);
    showUserModal("Login failed: User not found!");
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
    showUserModal("✅ Verification email resent! Check your inbox.", null, 6000);
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
      showUserModal("✅ Reset link sent! Check your email.", null, 6000);
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
