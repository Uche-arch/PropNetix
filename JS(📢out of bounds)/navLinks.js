// Get all the navigation links
const navLinks = document.querySelectorAll(".nav_links a");

// Loop through each link and add an event listener
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // Remove the active class from all links
    navLinks.forEach((link) => link.classList.remove("active"));

    // Add the active class to the clicked link
    this.classList.add("active");
  });
});

// Optional: Set the active class based on the current URL
window.addEventListener("load", () => {
  const currentUrl = window.location.href;
  navLinks.forEach((link) => {
    if (currentUrl.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });
});
