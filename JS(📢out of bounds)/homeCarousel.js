// Carousel Slide Functionality
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const totalSlides = slides.length;

function changeSlide() {
  slides.forEach((slide, index) => {
    slide.style.opacity = "0"; // Hide all slides
  });

  currentSlide = (currentSlide + 1) % totalSlides; // Move to next slide
  slides[currentSlide].style.opacity = "1"; // Show the new slide
}

// Change slide every 5 seconds
setInterval(changeSlide, 8000);
changeSlide(); // Initial slide change

// Scroll Down Effect (Reveal Content on Scroll)
// const contentSection = document.querySelector(".content-section");

// window.addEventListener("scroll", () => {
//   const scrollPosition = window.scrollY + window.innerHeight;
//   const contentPosition = contentSection.offsetTop;

//   if (scrollPosition > contentPosition) {
//     contentSection.classList.add("visible");
//   }
// });
