// public/js/search.js

document.addEventListener("DOMContentLoaded", () => {
    const searchToggle = document.getElementById("search-toggle");
    const searchDropdown = document.getElementById("search-dropdown");
    const overlay = document.getElementById("overlay");
    const searchInput = searchDropdown.querySelector("input");
  
    searchToggle.addEventListener("click", () => {
      searchDropdown.classList.remove("hidden");
      overlay.classList.remove("hidden");
      searchInput.focus();
    });
  
    overlay.addEventListener("click", () => {
      searchDropdown.classList.add("hidden");
      overlay.classList.add("hidden");
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchDropdown.classList.add("hidden");
        overlay.classList.add("hidden");
      }
    });
  
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query.length > 0) {
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
      }
    });
  });