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
        
        // Update scroll amount to include larger gap
        const scrollAmount = 240; // 140px card width + 100px gap
        
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
            justify-content: flex-start;
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
        
        section.profile-reviews {
            position: relative;
            margin: 0 auto;
            width: 100%;
            max-width: 1200px;
            overflow: hidden;
        }

        section.profile-ratings {
            position: relative;
            margin: 0 auto;
            width: 100%;
            overflow: hidden;
        }
        
        .review-item, .rating-item {
            flex: 0 0 auto;
            width: 300px;
            min-width: 300px;
            padding: 0 2rem;
        }
        
        .review-book, .rating-book {
            width: 140px;
            height: 200px;
            margin-bottom: 1rem;
            border-radius: 4px;
            overflow: hidden;
            background-color: #f0f0f0;
        }

        .review-book img, .rating-book img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
        }
        
        .review-content {
            width: 140px;
            font-size: 0.9rem;
            text-align: center;
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

        /* Center the reviews section */
        section.profile-reviews {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Rating stars styling */
        .rating-stars {
            display: flex;
            gap: 2px;
            justify-content: center;
            margin-top: 0.5rem;
        }

        .star {
            color: #ccc;
            font-size: 1rem;
        }

        .star.filled {
            color: #F58E5F;
        }

        /* Add padding to the sections for better spacing */
        section.profile-reviews,
        section.profile-ratings {
            padding: 2rem 0;
        }
    `;
    document.head.appendChild(style);

    // Debug: Log elements to check if they're found
    console.log('Reviews container found:', reviewsContainer);
    console.log('Ratings container found:', ratingsContainer);

    // Edit Profile Functionality
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const editProfilePopup = document.querySelector('.edit-profile-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    const cancelBtn = document.querySelector('.button-secondary');
    const editProfileForm = document.getElementById('edit-profile-form');
    const saveBtn = editProfileForm.querySelector('.button-primary');

    // Open popup
    editProfileBtn.addEventListener('click', () => {
        // Get current user data
        const firstName = document.querySelector('.profile-name').dataset.firstName;
        const lastName = document.querySelector('.profile-name').dataset.lastName;
        const genres = document.querySelector('.profile-preferences p.preference-value').textContent.split(', ');
        const discoveryFreq = document.querySelectorAll('.profile-preferences p.preference-value')[1].textContent;

        // Set form values
        document.getElementById('edit-first-name').value = firstName;
        document.getElementById('edit-last-name').value = lastName;

        // Set genres
        const genreCards = document.querySelectorAll('.genre-card');
        genreCards.forEach(card => {
            const genreName = card.querySelector('p').textContent;
            if (genres.includes(genreName)) {
                card.classList.add('selected');
            }
        });

        // Set discovery frequency
        const freqCards = document.querySelectorAll('.frequency-card');
        freqCards.forEach(card => {
            const freqText = card.querySelector('p').textContent;
            if (freqText === discoveryFreq) {
                card.classList.add('selected');
            }
        });

        editProfilePopup.classList.remove('hidden');
    });

    // Close popup
    function closePopup() {
        editProfilePopup.classList.add('hidden');
        // Reset form
        editProfileForm.reset();
        // Clear selections
        document.querySelectorAll('.genre-card.selected, .frequency-card.selected').forEach(card => {
            card.classList.remove('selected');
        });
    }

    closePopupBtn.addEventListener('click', closePopup);
    cancelBtn.addEventListener('click', closePopup);

    // Genre selection
    const genreCards = document.querySelectorAll('.genre-card');
    genreCards.forEach(card => {
        card.addEventListener('click', () => {
            const selectedGenres = document.querySelectorAll('.genre-card.selected');
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
            } else if (selectedGenres.length < 4) {
                card.classList.add('selected');
            }
        });
    });

    // Frequency selection
    const freqCards = document.querySelectorAll('.frequency-card');
    freqCards.forEach(card => {
        card.addEventListener('click', () => {
            freqCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    // Form submission
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const firstName = document.getElementById('edit-first-name').value;
        const lastName = document.getElementById('edit-last-name').value;
        const selectedGenres = Array.from(document.querySelectorAll('.genre-card.selected'))
            .map(card => card.dataset.genre);
        const selectedFreq = document.querySelector('.frequency-card.selected').dataset.freq;

        // Validate form
        if (!firstName || !lastName || selectedGenres.length === 0 || !selectedFreq) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (firstName.length < 2 || lastName.length < 2) {
            showMessage('First and last name must be at least 2 characters long', 'error');
            return;
        }

        // Show loading state
        saveBtn.disabled = true;
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        saveBtn.appendChild(spinner);
        spinner.style.display = 'inline-block';

        try {
            const res = await fetch('/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    genres: selectedGenres,
                    discovery_frequency: selectedFreq
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Update the profile display
                document.querySelector('.profile-name').textContent = `${firstName} ${lastName}`;
                document.querySelector('.profile-name').dataset.firstName = firstName;
                document.querySelector('.profile-name').dataset.lastName = lastName;
                document.querySelector('.profile-preferences p.preference-value').textContent = 
                    Array.from(document.querySelectorAll('.genre-card.selected'))
                        .map(card => card.querySelector('p').textContent)
                        .join(', ');
                document.querySelectorAll('.profile-preferences p.preference-value')[1].textContent = 
                    document.querySelector('.frequency-card.selected p').textContent;
                
                // Close popup and show success message
                editProfilePopup.classList.add('hidden');
                editProfileForm.reset();
                document.querySelectorAll('.genre-card.selected, .frequency-card.selected').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // Show success message after popup is closed
                setTimeout(() => {
                    showMessage('Profile updated successfully', 'success');
                }, 500);
            } else {
                showMessage(data.message || 'Error updating profile', 'error');
            }
        } catch (error) {
            showMessage('Error updating profile', 'error');
        } finally {
            // Remove loading state
            saveBtn.disabled = false;
            spinner.remove();
        }
    });

    // Show message function
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // Remove message after animation
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});
