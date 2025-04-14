const loginForm = document.getElementById("loginForm");
// function showTemporaryModal(modalId, duration = 2000) {
//   const modal = document.getElementById(modalId);
//   modal.style.display = "block";
//   setTimeout(() => {
//     modal.style.display = "none";
//     // if (reload) {
//     //   window.location.reload(); // Refresh the page after modal hides
//     // }
//   }, duration);
// }

function showTemporaryModal(modalId, message = "", duration = 2000) {
  const modal = document.getElementById(modalId);
  const modalMessage = document.getElementById("modalMessage");

  if (modalMessage && message) {
    modalMessage.textContent = message;
  }

  modal.style.display = "block";

  setTimeout(() => {
    modal.style.display = "none";
  }, duration);
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the username and password from the input fields
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Send only username and password in the body
  const response = await fetch("http://127.0.0.1:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }), // Corrected here
  });

  const data = await response.json();

  // if (data.token) {
  //   localStorage.setItem("token", data.token);
  //   window.location.href = "profile.html";
  // } else {
  //   alert("Error: " + data.message);
  // }

  // if (data.token) {
  //   localStorage.setItem("token", data.token);
  //   window.location.href = "profile.html";
  // } else {
  //   showTemporaryModal("invalidModal", data.message);
  // }

  if (response.ok && data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "profile.html";
  } else {
    // Show message from server in modal
    showTemporaryModal("invalidModal", "Invalid username or password");
  }
});
