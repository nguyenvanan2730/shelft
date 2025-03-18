console.log("Hi, I am a script file");

document.addEventListener('DOMContentLoaded', function() {
  const searchToggle = document.getElementById('search-toggle');
  const searchDropdown = document.getElementById('search-dropdown');
  const overlay = document.getElementById('overlay');
  let hideTimeout;

    // Show dropdown on hover (mouseenter) and hide on mouseleave
    searchToggle.addEventListener('mouseenter', function() {
      if (hideTimeout) clearTimeout(hideTimeout);
      searchDropdown.classList.remove('hidden');
      overlay.classList.remove('hidden');
    });

    searchToggle.addEventListener('mouseleave', function() {
      hideTimeout = setTimeout(() => {
        searchDropdown.classList.add('hidden');
        overlay.classList.add('hidden');
      }, 200);
    });

    //dropdown closes when you hover outside of the search bar
    searchDropdown.addEventListener('mouseenter', function() {
      if (hideTimeout) clearTimeout(hideTimeout);
    });

    searchDropdown.addEventListener('mouseleave', function() {
      hideTimeout = setTimeout(() => {
        searchDropdown.classList.add('hidden');
        overlay.classList.add('hidden');
      }, 200);
    });

    // Optional: hide dropdown when clicking on the overlay
    searchDropdown.addEventListener('mouseleave', function() {
      hideTimeout = setTimeout(() => {
        searchDropdown.classList.add('hidden');
        overlay.classList.add('hidden');
      }, 200);
    });
});