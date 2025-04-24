// Add an event listener to the logout button
document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        console.log("Logging out...");

        /**
         * Sends a logout request to the server.
         * @input - Click event on the logout button.
         * @output - If successful, user is redirected to the homepage and JWT cookie is cleared.
         */
        const res = await fetch('/logout', {
            method: 'GET', // Uses GET request to trigger logout route
            credentials: 'include' // Ensures cookies are sent with the request
        });

        /**
         * Checks if the response is a redirect.
         * If so, navigate to the homepage.
         */
        if (res.redirected) {
            console.log("Successfully logged out. Redirecting...");
            window.location.href = '/'; // Redirect to homepage after logout
        } else {
            console.error("Logout failed."); // If not redirected, log an error
        }
    } catch (error) {
        console.error("Error during logout:", error); // Catch and log any errors
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("User page JS loaded");
    
    // Debug: Check if libraryBooks data exists
    if (window.libraryBooks) {
        console.log("Library books data:", window.libraryBooks);
    } else {
        console.log("No library books data available in JS");
    }
    
    // Debug: Log all image elements and their sources
    const bookCovers = document.querySelectorAll('.book-cover img');
    console.log(`Found ${bookCovers.length} book cover images`);
    
    bookCovers.forEach((img, index) => {
        console.log(`Image ${index + 1} src:`, img.getAttribute('src'));
        
        // Add error handler to debug image loading failures
        img.addEventListener('error', function() {
            console.error(`Failed to load image: ${this.getAttribute('src')}`);
            
            // Show fallback content
            const fallback = document.createElement('div');
            fallback.className = 'image-error';
            fallback.textContent = 'Image not found';
            fallback.style.width = '100%';
            fallback.style.height = '100%';
            fallback.style.display = 'flex';
            fallback.style.justifyContent = 'center';
            fallback.style.alignItems = 'center';
            fallback.style.backgroundColor = '#ffdddd';
            fallback.style.color = '#ff0000';
            
            this.parentNode.replaceChild(fallback, this);
        });
    });
    
    // Debug: Check the images directory structure
    console.log("Checking for access to images directory...");
    fetch('/images/feather-pen.svg')
        .then(response => {
            console.log("Images directory access:", response.ok ? "Success" : "Failed");
            if (!response.ok) {
                console.error("Images directory might not be accessible");
            }
        })
        .catch(err => {
            console.error("Error checking images directory:", err);
        });
    
    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    removeButtons.forEach(button => {
        if (button.dataset.bookId) {
            button.addEventListener('click', function() {
                const bookId = this.dataset.bookId;
                removeFromLibrary(bookId);
            });
        }
    });
    
    /**
     * Remove a book from the user's library
     * @param {string} bookId - The ID of the book to remove
     */
    function removeFromLibrary(bookId) {
        if (!confirm('Are you sure you want to remove this book from your library?')) {
            return;
        }
        
        fetch(`/api/library/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to remove book from library');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Find the book item in the DOM and remove it
                const bookItem = document.querySelector(`.remove-btn[data-book-id="${bookId}"]`).parentNode;
                bookItem.classList.add('fade-out');
                
                // Update book count in the stats
                const statsNumber = document.querySelector('.stats-number');
                const currentCount = parseInt(statsNumber.textContent);
                if (!isNaN(currentCount) && currentCount > 0) {
                    statsNumber.textContent = currentCount - 1;
                }
                
                // Wait for the animation to finish before removing the element
                setTimeout(() => {
                    bookItem.remove();
                }, 500);
            } else {
                alert('Failed to remove book from library: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while removing the book from your library.');
        });
    }
    
    // Add event listeners for pagination (carousel navigation)
    const prevButtons = document.querySelectorAll('.prev');
    const nextButtons = document.querySelectorAll('.next');
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Pagination functionality would be implemented here
            alert('Previous page functionality not implemented yet.');
        });
    });
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Pagination functionality would be implemented here
            alert('Next page functionality not implemented yet.');
        });
    });
});
