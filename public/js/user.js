document.addEventListener('DOMContentLoaded', function() {
    console.log("User page JS loaded");

    // Logout button functionality
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                console.log("Logging out...");
                const res = await fetch('/logout', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (res.redirected) {
                    console.log("Successfully logged out. Redirecting...");
                    window.location.href = '/';
                } else {
                    console.error("Logout failed.");
                }
            } catch (error) {
                console.error("Error during logout:", error);
            }
        });
    }

    // Find all carousels on the page
    const reviewsContainer = document.querySelector('.reviews-container');
    const ratingsContainer = document.querySelector('.ratings-container');
    
    // Initialize each carousel
    [reviewsContainer, ratingsContainer].forEach(function(container) {
        if (!container) return;
        
        // Get navigation buttons for this carousel
        const section = container.closest('section');
        const prevButton = section.querySelector('.prev');
        const nextButton = section.querySelector('.next');
        
        // Skip if required elements aren't found
        if (!prevButton || !nextButton) {
            console.error("Missing navigation buttons for carousel");
            return;
        }
        
        // Set a fixed scroll amount (card width + gap)
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const gapInRem = 12;
        const gapInPixels = gapInRem * rootFontSize;
        const cardWidth = 220; // Width of review/rating card
        const scrollAmount = cardWidth + gapInPixels;
        
        // Function to scroll left
        function scrollLeft() {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Function to scroll right
        function scrollRight() {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Add event listeners to buttons
        prevButton.addEventListener('click', scrollLeft);
        nextButton.addEventListener('click', scrollRight);
        
        // Update button visibility based on scroll position
        function updateButtonVisibility() {
            // Check if at the beginning
            if (container.scrollLeft <= 0) {
                prevButton.style.opacity = '0.5';
                prevButton.classList.add('disabled');
            } else {
                prevButton.style.opacity = '1';
                prevButton.classList.remove('disabled');
            }
            
            // Check if at the end
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft >= maxScrollLeft - 5) {
                nextButton.style.opacity = '0.5';
                nextButton.classList.add('disabled');
            } else {
                nextButton.style.opacity = '1';
                nextButton.classList.remove('disabled');
            }
        }
        
        // Initialize button visibility
        updateButtonVisibility();
        
        // Update button visibility when scrolling
        container.addEventListener('scroll', updateButtonVisibility);
    });

    // Add necessary CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .reviews-container, .ratings-container {
            display: flex;
            gap: 12rem;
            overflow-x: auto;
            scroll-behavior: smooth;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 1rem 0;
        }
        
        .reviews-container::-webkit-scrollbar, 
        .ratings-container::-webkit-scrollbar {
            display: none;
        }
        
        section.profile-reviews, 
        section.profile-ratings {
            position: relative;
            margin: 0 auto;
            width: 100%;
        }
        
        .review-item, .rating-item {
            flex: 0 0 auto;
            width: 220px;
        }
        
        .review-book, .rating-book {
            width: 100%;
            height: 200px;
            margin-bottom: 1rem;
        }
        
        .review-content {
            width: 100%;
        }
        
        .carousel-nav {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .prev, .next {
            cursor: pointer;
            padding: 0.5rem 1rem;
            border: none;
            background: none;
            font-size: 1.5rem;
            color: #26345E;
            transition: all 0.3s ease;
        }
        
        .prev:hover, .next:hover {
            color: #F58E5F;
        }

        .prev.disabled, .next.disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .prev.disabled:hover, .next.disabled:hover {
            color: #26345E;
        }
    `;
    document.head.appendChild(style);

    // Debug: Log elements to check if they're found
    console.log('Reviews container found:', reviewsContainer);
    console.log('Ratings container found:', ratingsContainer);
});
