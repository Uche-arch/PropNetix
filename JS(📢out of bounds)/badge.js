// JS(📢out of bounds)/badge.js
// document.addEventListener("DOMContentLoaded", async function () {
//   const categories = ["apartments", "land", "shops"];

//   categories.forEach(async (cat) => {
//     const lastVisit =
//       localStorage.getItem(`lastVisit_${cat}`) || new Date(0).toISOString();

//     try {
//       const res = await fetch(
//         `https://propnetix-backend-v2.onrender.com/api/new-posts-count?category=${cat}&since=${lastVisit}`
//       );
//       const data = await res.json();

//       const badge = document.getElementById(`badge-${cat}`);
//       if (badge) {
//         if (data.newCount > 0) {
//           badge.textContent = data.newCount;
//           badge.style.display = "inline-block";
//         } else {
//           badge.style.display = "none";
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching new posts count:", err);
//     }
//   });
// });

// JS(📢out of bounds)/badge.js
document.addEventListener("DOMContentLoaded", async function () {
  const categories = ["apartments", "land", "shops"];

  categories.forEach(async (cat) => {
    const lastVisit =
      localStorage.getItem(`lastVisit_${cat}`) || new Date(0).toISOString();

    try {
      const res = await fetch(
        `https://propnetix-backend-v2.onrender.com/api/new-posts-count?category=${cat}&since=${lastVisit}`
      );
      const data = await res.json();

      const badge = document.getElementById(`badge-${cat}`);
      if (badge) {
        if (data.newCount > 0) {
          let displayValue;
          if (data.newCount <= 5) {
            displayValue = data.newCount; // normal
          } else {
            displayValue = (data.newCount - 1) + "+"; // custom format
          }
          badge.textContent = displayValue;
          badge.style.display = "inline-block";
        } else {
          badge.style.display = "none";
        }
      }
    } catch (err) {
      console.error("Error fetching new posts count:", err);
    }
  });
});

