// protect.js

// Disable right-click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Disable key combinations
document.addEventListener("keydown", function (e) {
  // F12
  if (e.key === "F12") {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+I or Ctrl+Shift+J
  if (
    e.ctrlKey &&
    e.shiftKey &&
    (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")
  ) {
    e.preventDefault();
    return false;
  }

  // Ctrl+U or Ctrl+S
  if (
    e.ctrlKey &&
    (e.key.toLowerCase() === "u" || e.key.toLowerCase() === "s")
  ) {
    e.preventDefault();
    return false;
  }
});
