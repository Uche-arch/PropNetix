
const auth = firebase.auth();

// 📦 DOM Elements
const signupForm = document.getElementById("signupForm");
const userModal = document.getElementById("userModal");
const modalMessage = document.getElementById("modalMessage");

// 📢 Utility: Show modal message and optionally redirect
function showModalMessage(message, redirectUrl = null, delay = 2800) {
  modalMessage.textContent = message;
  userModal.style.display = "flex"; // or "block" based on your modal CSS

  setTimeout(() => {
    userModal.style.display = "none";
    if (redirectUrl) window.location.href = redirectUrl;
  }, delay);
}


const signupBtn = document.getElementById("signupBtn");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const errorMessage = document.getElementById("errorMessage");
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");


let currentField = null;

// 👁️ Toggle Password Visibility
togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.textContent = type === "password" ? "👁️" : "🙈";
});

// Toggle password visibility
toggleConfirmPassword.addEventListener("click", () => {
  const type = confirmPasswordInput.type === "password" ? "text" : "password";
  confirmPasswordInput.type = type;
  toggleConfirmPassword.textContent = type === "password" ? "👁️" : "🙈";
});


// 🔍 Field-specific validation
function validateUsername(username) {
  if (username.length < 5) return "Username must be at least 5 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Username must be alphanumeric.";
  return "";
}

function validatePassword(password) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/[a-z]/i.test(password) || !/[0-9]/.test(password))
    return "Password must include letters and numbers.";
  if (!/[^a-zA-Z0-9]/.test(password))
    return "Password must include a special symbol.";
  return "";
}


function validateConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
}

function validateEmail(email) {
  if (!email.includes("@") || !email.includes("."))
    return "Enter a valid email.";
  return "";
}

// 🧠 Master Validator
function updateFormState() {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  let error = "";

  if (currentField === "username") {
    error = validateUsername(username);
  } else if (currentField === "email") {
    error = validateEmail(email);
  } else if (currentField === "password") {
    error = validatePassword(password);
  } else if (currentField === "confirmPassword") {
    error = validateConfirmPassword(password, confirmPassword);
  }

  // Show error
  errorMessage.textContent = error;

  // Enable Sign Up button if everything is valid
  const allValid =
    !validateUsername(username) &&
    !validateEmail(email) &&
    !validatePassword(password) &&
    !validateConfirmPassword(password, confirmPassword);

  signupBtn.disabled = !allValid;
}

// 🎯 Trigger validation only while typing in the current field
usernameInput.addEventListener("input", () => {
  currentField = "username";
  updateFormState();
});
emailInput.addEventListener("input", () => {
  currentField = "email";
  updateFormState();
});
passwordInput.addEventListener("input", () => {
  currentField = "password";
  updateFormState();
});
confirmPasswordInput.addEventListener("input", () => {
  currentField = "confirmPassword";
  updateFormState();
});



// ✍️ Signup Form Submission Handler
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  signupBtn.disabled = true;
  errorMessage.textContent = "";



  // 📥 Grab user inputs
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // ✅ Step 1: Check username availability from backend
    const checkResponse = await fetch(
      `https://propnetix-backend-v2.onrender.com/api/check-username?username=${encodeURIComponent(
        username
      )}`
    );
    const checkResult = await checkResponse.json();

    if (!checkResponse.ok || !checkResult.available) {
      showModalMessage(
        "❌ Username already taken or unavailable. Please choose another.", null, 3000
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
    const saveResponse = await fetch(
      "https://propnetix-backend-v2.onrender.com/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      }
    );

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
    showModalMessage("❌ Signup failed: An error occured, check internet connection and try again");
    signupBtn.disabled = false; // Re-enable if failed
  }
});
