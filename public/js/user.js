document.addEventListener('DOMContentLoaded', function() {
    console.log("User page JS loaded");

    // Logout button functionality
    const logoutButton = document.querySelector('.logout-btn');
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

    // Track removed books
    const removedBookIds = new Set();

    // Add click event listeners for book items in different sections
    function addBookClickListeners() {
        // Library section
        const libraryBooks = document.querySelectorAll('.library-grid .book-item');
        libraryBooks.forEach(bookItem => {
            const bookCover = bookItem.querySelector('.book-cover');
            const removeBtn = bookItem.querySelector('.remove-btn');
            const bookId = removeBtn.getAttribute('data-book-id');
            
            bookCover.addEventListener('click', () => {
                window.location.href = `/book/${bookId}`;
            });
        });

        // Reviews section
        const reviewItems = document.querySelectorAll('.reviews-container-user .review-item');
        reviewItems.forEach(reviewItem => {
            const bookCover = reviewItem.querySelector('.review-book');
            const bookId = reviewItem.getAttribute('data-book-id');
            
            if (bookId) {
                bookCover.addEventListener('click', () => {
                    window.location.href = `/book/${bookId}`;
                });
            }
        });

        // Ratings section
        const ratingItems = document.querySelectorAll('.ratings-container .rating-item');
        ratingItems.forEach(ratingItem => {
            const bookCover = ratingItem.querySelector('.rating-book');
            const bookId = ratingItem.getAttribute('data-book-id');
            
            if (bookId) {
                bookCover.addEventListener('click', () => {
                    window.location.href = `/book/${bookId}`;
                });
            }
        });
    }

    // Call the function to add click listeners
    addBookClickListeners();

    // Find all carousels on the page
    const reviewsContainer = document.querySelector('.reviews-container-user');
    const ratingsContainer = document.querySelector('.ratings-container');
    
    // Initialize each carousel
    [reviewsContainer, ratingsContainer].forEach(function(container) {
        if (!container) return;
        
        // Get navigation buttons for this carousel
        const section = container.closest('section');
        const navContainer = section.querySelector('.carousel-nav-user');
        const prevButton = navContainer?.querySelector('.prev');
        const nextButton = navContainer?.querySelector('.next');
        
        // Skip if required elements aren't found
        if (!prevButton || !nextButton) {
            console.error("Missing navigation buttons for carousel");
            return;
        }
        
        // Update scroll amount to include larger gap
        const scrollAmount = 240; // 140px card width + 100px gap
        
        // Function to scroll left
        function scrollLeft() {
            if (prevButton.classList.contains('disabled')) return;
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Function to scroll right
        function scrollRight() {
            if (nextButton.classList.contains('disabled')) return;
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
                prevButton.style.cursor = 'not-allowed';
            } else {
                prevButton.style.opacity = '1';
                prevButton.classList.remove('disabled');
                prevButton.style.cursor = 'pointer';
            }
            
            // Check if at the end
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft >= maxScrollLeft - 5) {
                nextButton.style.opacity = '0.5';
                nextButton.classList.add('disabled');
                nextButton.style.cursor = 'not-allowed';
            } else {
                nextButton.style.opacity = '1';
                nextButton.classList.remove('disabled');
                nextButton.style.cursor = 'pointer';
            }
        }
        
        // Initialize button visibility - disable left arrow by default
        prevButton.style.opacity = '0.5';
        prevButton.classList.add('disabled');
        prevButton.style.cursor = 'not-allowed';
        
        // Update button visibility when scrolling
        container.addEventListener('scroll', updateButtonVisibility);
    });

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

    // Remove book from library functionality
    const libraryGrid = document.querySelector('.library-grid');
    if (libraryGrid) {
        libraryGrid.addEventListener('click', async function(e) {
            const removeBtn = e.target.closest('.remove-btn');
            if (!removeBtn) return;

            const bookId = removeBtn.getAttribute('data-book-id');
            if (!bookId) return;

            try {
                const response = await fetch(`/api/library/${bookId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const data = await response.json();
                
                if (data.success) {
                    // Add the book ID to the removed set
                    removedBookIds.add(bookId);
                    
                    // Remove the book item from the DOM with animation
                    const bookItem = removeBtn.closest('.book-item');
                    bookItem.classList.add('fade-out');
                    
                    // Wait for animation to complete before removing
                    setTimeout(() => {
                        bookItem.remove();
                        
                        // Update book count
                        const statsNumber = document.querySelector('.stats-number');
                        if (statsNumber) {
                            const currentCount = parseInt(statsNumber.textContent);
                            statsNumber.textContent = currentCount - 1;
                        }

                        // Get the next book from the remaining list, excluding removed books
                        const currentBooks = Array.from(libraryGrid.querySelectorAll('.book-item'));
                        const remainingBooks = window.libraryBooks.filter(book => 
                            !removedBookIds.has(book.book_id.toString()) && 
                            !currentBooks.some(item => item.querySelector('.remove-btn').getAttribute('data-book-id') === book.book_id.toString())
                        );

                        if (remainingBooks.length > 0) {
                            const nextBook = remainingBooks[0];
                            const newBookItem = createBookItem(nextBook);
                            libraryGrid.appendChild(newBookItem);
                        }
                        
                        // Show success message
                        showMessage('Book removed from library', 'success');
                    }, 500);
                } else {
                    showMessage('Failed to remove book', 'error');
                }
            } catch (error) {
                console.error('Error removing book:', error);
                showMessage('Error removing book', 'error');
            }
        });
    }

    // Function to create a new book item
    function createBookItem(book) {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        
        const bookCover = document.createElement('div');
        bookCover.className = 'book-cover';
        
        if (book.cover_image) {
            const img = document.createElement('img');
            img.src = `/images/${book.cover_image}`;
            img.alt = book.title;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            bookCover.appendChild(img);
        }
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.setAttribute('data-book-id', book.book_id);
        removeBtn.textContent = 'remove';
        
        bookItem.appendChild(bookCover);
        bookItem.appendChild(removeBtn);
        
        return bookItem;
    }

    // Change Avatar Functionality
    const profileImage = document.querySelector('.profile-image img');

    profileImage.addEventListener('click', async () => {
        try {
            // Show loading state
            profileImage.style.opacity = '0.7';
            profileImage.style.cursor = 'wait';

            // Call the API to get a new avatar
            const response = await fetch('/change-avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Update the profile image
                    profileImage.src = `/${data.avatarPath}`;
                    showMessage('Avatar updated successfully', 'success');
                } else {
                    showMessage(data.message || 'Error updating avatar', 'error');
                }
            } else {
                showMessage('Error updating avatar', 'error');
            }
        } catch (error) {
            console.error('Error changing avatar:', error);
            showMessage('Error updating avatar', 'error');
        } finally {
            // Remove loading state
            profileImage.style.opacity = '1';
            profileImage.style.cursor = 'pointer';
        }
    });
});
