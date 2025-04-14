document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("feedback-button");

  const fadeCycle = () => {
    // Show the button
    button.classList.add("visible");

    // After 1 minute (60s), hide the button
    setTimeout(() => {
      button.classList.remove("visible");

      // After 10 seconds of being hidden, start the cycle again
      setTimeout(fadeCycle, 7000);
    }, 30000);
  };

  // Start the cycle on initial page load
  fadeCycle();
});
