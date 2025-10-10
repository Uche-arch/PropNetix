// const auth = firebase.auth();

// // 📦 DOM Elements
// const signupForm = document.getElementById("signupForm");
// const userModal = document.getElementById("userModal");
// const modalMessage = document.getElementById("modalMessage");

// // 📢 Utility: Show modal message and optionally redirect
// function showModalMessage(message, redirectUrl = null, delay = 3900) {
//   modalMessage.textContent = message;
//   userModal.style.display = "flex"; // or "block" based on your modal CSS

//   setTimeout(() => {
//     userModal.style.display = "none";
//     if (redirectUrl) window.location.href = redirectUrl;
//   }, delay);
// }

// const signupBtn = document.getElementById("signupBtn");
// const usernameInput = document.getElementById("username");
// const emailInput = document.getElementById("email");
// const passwordInput = document.getElementById("password");
// const confirmPasswordInput = document.getElementById("confirmPassword");
// const errorMessage = document.getElementById("errorMessage");
// const togglePassword = document.getElementById("togglePassword");
// const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

// let currentField = null;

// // Toggle Visibility
// togglePassword.addEventListener("click", () => {
//   const type = passwordInput.type === "password" ? "text" : "password";
//   passwordInput.type = type;

//   const icon = togglePassword.querySelector("i");
//   icon.classList.toggle("fa-eye");
//   icon.classList.toggle("fa-eye-slash");
// });

// // Toggle Invisibility
// toggleConfirmPassword.addEventListener("click", () => {
//   const type = confirmPasswordInput.type === "password" ? "text" : "password";
//   confirmPasswordInput.type = type;

//   const icon = toggleConfirmPassword.querySelector("i");
//   icon.classList.toggle("fa-eye");
//   icon.classList.toggle("fa-eye-slash");
// });

// // 🔍 Field-specific validation
// function validateUsername(username) {
//   if (username.length < 5)
//     return "Username must be at least 5 characters. No spacing.";
//   if (!/^[a-zA-Z0-9_]+$/.test(username))
//     return "Username must be alphanumeric.";
//   return "";
// }

// function validatePassword(password) {
//   if (password.length < 6) return "Password must be at least 6 characters.";
//   if (!/[a-z]/i.test(password) || !/[0-9]/.test(password))
//     return "Password must include letters and numbers.";
//   if (!/[^a-zA-Z0-9]/.test(password))
//     return "Password must include a special symbol.";
//   return "";
// }

// function validateConfirmPassword(password, confirmPassword) {
//   if (password !== confirmPassword) return "Passwords do not match.";
//   return "";
// }

// function validateEmail(email) {
//   if (!email.includes("@") || !email.includes("."))
//     return "Enter a valid email.";
//   return "";
// }

// // 🧠 Master Validator
// function updateFormState() {
//   const username = usernameInput.value.trim();
//   const email = emailInput.value.trim();
//   const password = passwordInput.value;
//   const confirmPassword = confirmPasswordInput.value;

//   let error = "";

//   if (currentField === "username") {
//     error = validateUsername(username);
//   } else if (currentField === "email") {
//     error = validateEmail(email);
//   } else if (currentField === "password") {
//     error = validatePassword(password);
//   } else if (currentField === "confirmPassword") {
//     error = validateConfirmPassword(password, confirmPassword);
//   }

//   // Show error
//   errorMessage.textContent = error;

//   // Enable Sign Up button if everything is valid
//   const allValid =
//     !validateUsername(username) &&
//     !validateEmail(email) &&
//     !validatePassword(password) &&
//     !validateConfirmPassword(password, confirmPassword);

//   signupBtn.disabled = !allValid;
// }

// // 🎯 Trigger validation only while typing in the current field
// usernameInput.addEventListener("input", () => {
//   currentField = "username";
//   updateFormState();
// });
// emailInput.addEventListener("input", () => {
//   currentField = "email";
//   updateFormState();
// });
// passwordInput.addEventListener("input", () => {
//   currentField = "password";
//   updateFormState();
// });
// confirmPasswordInput.addEventListener("input", () => {
//   currentField = "confirmPassword";
//   updateFormState();
// });

// // ✍️ Signup Form Submission Handler
// signupForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   signupBtn.disabled = true;
//   signupBtn.textContent = "Loading...";
//   errorMessage.textContent = "";

//   // 📥 Grab user inputs
//   const username = document.getElementById("username").value.trim();
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value;

//   try {
//     // ✅ Step 1: Check username availability from backend
//     const checkResponse = await fetch(
//       `https://propnetix-backend-v2.onrender.com/api/check-username?username=${encodeURIComponent(
//         username
//       )}`
//     );
//     const checkResult = await checkResponse.json();

//     if (!checkResponse.ok || !checkResult.available) {
//       showModalMessage(
//         "Oops! Someone's already using that username. Choose another one.",
//         null,
//         3000
//       );
//       return;
//     }

//     const userCredential = await auth.createUserWithEmailAndPassword(
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // 🔐 Get Firebase ID token
//     const idToken = await user.getIdToken();

//     // ✅ Send verification email from your backend
//     await fetch(
//       "https://propnetix-backend-v2.onrender.com/api/send-verification-email",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           uid: user.uid,
//           email: user.email,
//         }),
//       }
//     );

//     // ✅ Step 5: Send username to backend to save in MongoDB
//     const saveResponse = await fetch(
//       "https://propnetix-backend-v2.onrender.com/api/register",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`, // ✅ Use correct token here
//         },
//         body: JSON.stringify({ username }),
//       }
//     );

//     const saveResult = await saveResponse.json();

//     // ✅ Step 6: Final feedback to user
//     if (
//       saveResponse.ok &&
//       saveResult.message === "User registered successfully"
//     ) {
//       showModalMessage(
//         "Verification email sent. Please check your inbox and spam folder to verify your email before logging in.",
//         "login.html",
//         9000
//       );
//     } else {
//       showModalMessage(
//         "⚠️ Verification email sent, but backend failed: " + saveResult.message
//       );
//     }
//   } catch (error) {
//     console.error("Signup failed:", error);
//     showModalMessage(error);
//     signupBtn.disabled = false; // Re-enable if failed
//     signupBtn.textContent = "Register";
//   }
// });



// NEW SIGNUP SESSION CODE
// const auth = firebase.auth();

// 📦 DOM Elements
const signupForm = document.getElementById("signupForm");
const userModal = document.getElementById("userModal");
const modalMessage = document.getElementById("modalMessage");

// 📢 Modal Utility
function showModalMessage(message, redirectUrl = null, delay = 3900) {
  modalMessage.textContent = message;
  userModal.style.display = "flex";

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

// 👁 Toggle Password Visibility
togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;

  const icon = togglePassword.querySelector("i");
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
});

toggleConfirmPassword.addEventListener("click", () => {
  const type = confirmPasswordInput.type === "password" ? "text" : "password";
  confirmPasswordInput.type = type;

  const icon = toggleConfirmPassword.querySelector("i");
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
});

// ✅ Validation Functions (same as yours)
function validateUsername(username) {
  if (username.length < 5) return "Username must be at least 5 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Username must be alphanumeric.";
  return "";
}
function validateEmail(email) {
  if (!email.includes("@") || !email.includes("."))
    return "Enter a valid email.";
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

function updateFormState() {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  let error = "";

  if (currentField === "username") error = validateUsername(username);
  else if (currentField === "email") error = validateEmail(email);
  else if (currentField === "password") error = validatePassword(password);
  else if (currentField === "confirmPassword")
    error = validateConfirmPassword(password, confirmPassword);

  errorMessage.textContent = error;

  const allValid =
    !validateUsername(username) &&
    !validateEmail(email) &&
    !validatePassword(password) &&
    !validateConfirmPassword(password, confirmPassword);

  signupBtn.disabled = !allValid;
}

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

// ✍️ Signup Submission Handler
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  signupBtn.disabled = true;
  signupBtn.textContent = "Loading...";
  errorMessage.textContent = "";

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const checkResponse = await fetch(
      `https://propnetix-backend-v2.onrender.com/api/check-username?username=${encodeURIComponent(
        username
      )}`
    );
    const checkResult = await checkResponse.json();

    if (!checkResponse.ok || !checkResult.available) {
      showModalMessage("Username already taken.", null, 3000);
      return;
    }

    // ✅ Set persistent login
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    // Send verification email
    await fetch(
      "https://propnetix-backend-v2.onrender.com/api/send-verification-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      }
    );

    // Register to backend
    const saveResponse = await fetch(
      "https://propnetix-backend-v2.onrender.com/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ username }),
      }
    );

    const saveResult = await saveResponse.json();

    if (
      saveResponse.ok &&
      saveResult.message === "User registered successfully"
    ) {
      showModalMessage(
        "Verification email sent. Check your inbox and spam folder.",
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
    showModalMessage(error.message || "Signup failed");
    signupBtn.disabled = false;
    signupBtn.textContent = "Register";
  }
});
