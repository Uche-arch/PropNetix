const toggleBtn = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light");
  icon.className = "fas fa-sun"; // dark mode icon
} else {
  icon.className = "fas fa-moon"; // light mode icon
}

// Toggle on click
toggleBtn.addEventListener("click", () => {
  // Enable smooth transition
  body.classList.add("enable-transition");

  const isLight = body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  icon.className = isLight ? "fas fa-sun" : "fas fa-moon";
});
