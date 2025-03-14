console.log("Hi, I am a script file");

document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('search-toggle');
    const searchDropdown = document.getElementById('search-dropdown');
    const overlay = document.getElementById('overlay'); 

    // Show dropdown on hover (mouseenter) and hide on mouseleave
    searchToggle.addEventListener('mouseenter', function() {
        searchDropdown.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });

    searchToggle.addEventListener('mouseleave', function() {
        setTimeout(() => {
            searchDropdown.classList.add('hidden');
            overlay.classList.add('hidden');
        }, 200);
    });

    //dropdown closes when you hover outside of the search bar
    searchDropdown.addEventListener('mouseenter', function() {
        clearTimeout(hideDropdownTimeout);  // Prevent dropdown from hiding if hovering over it
    });

    searchDropdown.addEventListener('mouseleave', function() {
        setTimeout(() => {
            searchDropdown.classList.add('hidden');
            overlay.classList.add('hidden');
        }, 200);
    });

    // Optional: hide dropdown when clicking on the overlay
    overlay.addEventListener("click", function() {
        searchDropdown.classList.add('hidden');
        overlay.classList.add('hidden');
    });
});

