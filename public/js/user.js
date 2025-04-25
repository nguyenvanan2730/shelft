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

    // Carousel functionality
    const prevButtons = document.querySelectorAll('.prev');
    const nextButtons = document.querySelectorAll('.next');
    
    // Keep track of current positions for each carousel
    let reviewsPosition = 0;
    let ratingsPosition = 0;

    // Get the carousel containers
    const reviewsContainer = document.querySelector('.reviews-container');
    const ratingsContainer = document.querySelector('.ratings-container');

    // Initialize containers
    if (reviewsContainer) {
        reviewsContainer.style.position = 'relative';
        reviewsContainer.style.transition = 'transform 0.3s ease-in-out';
        updateNavigationState(reviewsContainer, reviewsPosition);
    }
    
    if (ratingsContainer) {
        ratingsContainer.style.position = 'relative';
        ratingsContainer.style.transition = 'transform 0.3s ease-in-out';
        updateNavigationState(ratingsContainer, ratingsPosition);
    }

    if (prevButtons && nextButtons) {
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const container = this.closest('section').querySelector('.reviews-container, .ratings-container');
                if (!container) return;
                
                if (container.classList.contains('reviews-container')) {
                    if (reviewsPosition > 0) {
                        reviewsPosition--;
                        slideCarousel(container, reviewsPosition);
                        updateNavigationState(container, reviewsPosition);
                    }
                } else if (container.classList.contains('ratings-container')) {
                    if (ratingsPosition > 0) {
                        ratingsPosition--;
                        slideCarousel(container, ratingsPosition);
                        updateNavigationState(container, ratingsPosition);
                    }
                }
            });
        });

        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const container = this.closest('section').querySelector('.reviews-container, .ratings-container');
                if (!container) return;
                
                const items = container.children;
                const maxPosition = getMaxPosition(container);
                
                if (container.classList.contains('reviews-container')) {
                    if (reviewsPosition < maxPosition) {
                        reviewsPosition++;
                        slideCarousel(container, reviewsPosition);
                        updateNavigationState(container, reviewsPosition);
                    }
                } else if (container.classList.contains('ratings-container')) {
                    if (ratingsPosition < maxPosition) {
                        ratingsPosition++;
                        slideCarousel(container, ratingsPosition);
                        updateNavigationState(container, ratingsPosition);
                    }
                }
            });
        });
    }

    function getMaxPosition(container) {
        const items = container.children;
        const containerWidth = container.offsetWidth;
        const itemWidth = container.querySelector('.review-item, .rating-item').offsetWidth;
        const gap = parseFloat(getComputedStyle(container).gap) || 0;
        const itemsPerView = Math.floor(containerWidth / (itemWidth + gap));
        return Math.max(0, items.length - itemsPerView);
    }

    function updateNavigationState(container, position) {
        const section = container.closest('section');
        const prevButton = section.querySelector('.prev');
        const nextButton = section.querySelector('.next');
        const maxPosition = getMaxPosition(container);

        // Update button states
        if (prevButton) {
            if (position <= 0) {
                prevButton.classList.add('disabled');
                prevButton.style.opacity = '0.5';
            } else {
                prevButton.classList.remove('disabled');
                prevButton.style.opacity = '1';
            }
        }

        if (nextButton) {
            if (position >= maxPosition) {
                nextButton.classList.add('disabled');
                nextButton.style.opacity = '0.5';
            } else {
                nextButton.classList.remove('disabled');
                nextButton.style.opacity = '1';
            }
        }
    }

    function slideCarousel(container, position) {
        const itemWidth = container.querySelector('.review-item, .rating-item').offsetWidth;
        const gap = parseFloat(getComputedStyle(container).gap) || 0;
        const offset = -(position * (itemWidth + gap));
        
        container.style.transform = `translateX(${offset}px)`;
        console.log(`Sliding to position ${position}, offset: ${offset}px`);
    }

    // Add necessary CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .reviews-container, .ratings-container {
            display: flex;
            position: relative;
            transition: transform 0.3s ease-in-out;
            gap: 12rem;
            overflow: hidden;
            width: 100%;
        }
        
        .review-item, .rating-item {
            flex: 0 0 auto;
            width: 220px;
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
        }

        .prev.disabled:hover, .next.disabled:hover {
            color: #26345E;
        }
    `;
    document.head.appendChild(style);

    // Debug: Log elements to check if they're found
    console.log('Prev buttons found:', prevButtons.length);
    console.log('Next buttons found:', nextButtons.length);
    console.log('Reviews container found:', reviewsContainer);
    console.log('Ratings container found:', ratingsContainer);
});
