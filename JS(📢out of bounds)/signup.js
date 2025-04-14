const signupForm = document.getElementById("signupForm");
function showTemporaryModal(modalId, duration = 2000, redirectUrl = null) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
  setTimeout(() => {
    modal.style.display = "none";
    if (redirectUrl) {
      window.location.href = redirectUrl; // Refresh the page after modal hides
    }
  }, duration);
}
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch(
    "https://propnetixbackend.onrender.com/api/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      // body: JSON.stringify({ username, email, password }),
    }
  );

  const data = await response.json();
  if (data.message === "User created successfully") {
    
    showTemporaryModal("userModal", 2000, "login.html");
    // window.location.href = "login.html";
  } else {
    alert("Error: " + data.message);
  }
});
