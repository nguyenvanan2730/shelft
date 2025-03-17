// test to see if index.js file loads on browser
console.log("Carousel JavaScript loaded!");

const preferencesAlert = document.getElementsByClassName('preferences-success-alert')[0];
const closePreferencesAlert = document.getElementsByClassName('close-preferences-success-alert')[0];

closePreferencesAlert.addEventListener('click', () => {
    preferencesAlert.classList.add('hidden-msg');
});

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);

    if (params.get("preferencesSaved") === "true") {
        console.log('Preferences saved');
        preferencesAlert.classList.remove('hidden-msg');
        history.replaceState({}, document.title, window.location.pathname);
    }
});

//books carousel mouse hover and manual scrolling
document.addEventListener('DOMContentLoaded', function() {
    console.log("Carousel JavaScript loaded!");
    
    // Find all carousels on the page
    const carousels = document.querySelectorAll('.carousel-container');
    
    // Initialize each carousel
    carousels.forEach(function(carousel) {
        // Get elements for this specific carousel
        const itemsContainer = carousel.querySelector('.carousel-items');
        const prevButton = carousel.querySelector('.prev') || carousel.nextElementSibling.querySelector('.prev');
        const nextButton = carousel.querySelector('.next') || carousel.nextElementSibling.querySelector('.next');
        
        // Skip if required elements aren't found
        if (!itemsContainer || !prevButton || !nextButton) {
            console.error("Missing required elements for a carousel");
            return;
        }
        
        // Set a fixed scroll amount (card width + gap)
        const scrollAmount = 170; // 140px card width + 30px gap
        
        // Function to scroll left
        function scrollLeft() {
            itemsContainer.scrollLeft -= scrollAmount;
        }
        
        // Function to scroll right
        function scrollRight() {
            itemsContainer.scrollLeft += scrollAmount;
        }
        
        // Add event listeners to buttons
        prevButton.addEventListener('click', scrollLeft);
        nextButton.addEventListener('click', scrollRight);
        
        // Update button visibility based on scroll position
        function updateButtonVisibility() {
            // Check if at the beginning
            if (itemsContainer.scrollLeft <= 0) {
                prevButton.style.opacity = '0.5';
            } else {
                prevButton.style.opacity = '1';
            }
            
            // Check if at the end
            const maxScrollLeft = itemsContainer.scrollWidth - itemsContainer.clientWidth;
            if (itemsContainer.scrollLeft >= maxScrollLeft - 5) {
                nextButton.style.opacity = '0.5';
            } else {
                nextButton.style.opacity = '1';
            }
        }
        
        // Initialize button visibility
        updateButtonVisibility();
        
        // Update button visibility when scrolling
        itemsContainer.addEventListener('scroll', updateButtonVisibility);
        
        // Force the container to be wider than its parent to ensure scrolling is needed
        const bookCards = itemsContainer.querySelectorAll('.book-card');
        if (bookCards.length > 0) {
            // Add a small delay to ensure all elements are fully rendered
            setTimeout(() => {
                // Calculate and set the minimum width needed
                const totalWidth = (bookCards[0].offsetWidth + 30) * bookCards.length;
                
                // Only set inline style if needed (if wrapping is occurring)
                if (itemsContainer.scrollWidth <= itemsContainer.clientWidth) {
                    console.log(`Fixing carousel width: ${totalWidth}px`);
                    const cardsContainer = document.createElement('div');
                    cardsContainer.style.display = 'inline-flex';
                    cardsContainer.style.gap = '30px';
                    cardsContainer.style.minWidth = `${totalWidth}px`;
                    
                    // Move book cards into the new container
                    while (itemsContainer.firstChild) {
                        cardsContainer.appendChild(itemsContainer.firstChild);
                    }
                    
                    // Add the new container
                    itemsContainer.appendChild(cardsContainer);
                    
                    // Re-check button visibility after modifying DOM
                    updateButtonVisibility();
                }
            }, 100);
        }
    });
    
    // Add keyboard navigation (affects the carousel in view)
    document.addEventListener('keydown', function(event) {
        // Find the carousel in view
        const carousels = document.querySelectorAll('.carousel-container');
        let inViewCarousel = null;
        
        carousels.forEach(carousel => {
            const rect = carousel.getBoundingClientRect();
            // Check if carousel is in viewport
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                inViewCarousel = carousel;
            }
        });
        
        if (inViewCarousel) {
            const itemsContainer = inViewCarousel.querySelector('.carousel-items');
            const scrollAmount = 170;
            
            if (event.key === 'ArrowLeft') {
                itemsContainer.scrollLeft -= scrollAmount;
            } else if (event.key === 'ArrowRight') {
                itemsContainer.scrollLeft += scrollAmount;
            }
        }
    });
});