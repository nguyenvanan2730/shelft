console.log("Hi, I am a script file");

// SEARCH BAR DROPDOWN TOGGLE 
document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('search-toggle');
    const searchDropdown = document.getElementById('search-dropdown');
    const overlay = document.getElementById('overlay'); 

    // toggle between hidden and not hidden on click
    searchToggle.addEventListener('click', function() {
        searchDropdown.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
    });

    // hide dropdown and overlay on click
    document.addEventListener('click', function(event) {
        if (
            !searchDropdown.contains(event.target) && 
            !searchToggle.contains(event.target)
        ) {
            searchDropdown.classList.add('hidden');
            overlay.classList.add('hidden');
        }
    });

    // close search when clicking on overlay
    overlay.addEventListener("click", function(){
        searchDropdown.classList.add('hidden');
        overlay.classList.add('hidden');
    });     
});

