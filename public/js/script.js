console.log("Hi, I am a script file");

document.addEventListener('DOMContentLoaded', function() {
  // Get references to the search elements
  const searchToggle = document.getElementById('search-toggle'); // The search button
  const searchDropdown = document.getElementById('search-dropdown'); // The dropdown menu
  const overlay = document.getElementById('overlay'); // Background overlay
  let hideTimeout; // Timeout variable to delay hiding

  /**
   * Shows the search dropdown and overlay when the mouse enters the search button.
   * @input - Mouse enters the searchToggle element.
   * @output - Removes 'hidden' class from searchDropdown and overlay.
   */
  searchToggle.addEventListener('mouseenter', function() {
    if (hideTimeout) clearTimeout(hideTimeout); // Clear any pending hide timeout
    searchDropdown.classList.remove('hidden'); // Show dropdown
    overlay.classList.remove('hidden'); // Show overlay
  });

  /**
   * Hides the search dropdown and overlay when the mouse leaves the search button.
   * @input - Mouse leaves the searchToggle element.
   * @output - Adds 'hidden' class after 200ms delay.
   */
  searchToggle.addEventListener('mouseleave', function() {
    hideTimeout = setTimeout(() => {
      searchDropdown.classList.add('hidden'); // Hide dropdown
      overlay.classList.add('hidden'); // Hide overlay
    }, 200);
  });

  /**
   * Keeps the dropdown visible when the mouse enters it.
   * @input - Mouse enters the searchDropdown element.
   * @output - Clears any hide timeout to prevent hiding.
   */
  searchDropdown.addEventListener('mouseenter', function() {
    if (hideTimeout) clearTimeout(hideTimeout); // Stop dropdown from hiding
  });

  /**
   * Hides the search dropdown and overlay when the mouse leaves the dropdown.
   * @input - Mouse leaves the searchDropdown element.
   * @output - Adds 'hidden' class after 200ms delay.
   */
  searchDropdown.addEventListener('mouseleave', function() {
    hideTimeout = setTimeout(() => {
      searchDropdown.classList.add('hidden'); // Hide dropdown
      overlay.classList.add('hidden'); // Hide overlay
    }, 200);
  });
});
