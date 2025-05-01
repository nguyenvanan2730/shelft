// book detail page rate and review dynamic functionalities 

document.addEventListener('DOMContentLoaded', () => {
    let selectedRating = 0;

    //star rating logic
    document.querySelectorAll('.rating-detail-stars').forEach(starContainer => {
        const stars = starContainer.querySelectorAll('.star');

        stars.forEach((star, index) => {
            star.addEventListener('mouseover', () => {
                stars.forEach((s, i) => {
                    s.src = i <= index ? '/images/rate-star.svg' : '/images/rate-stroke.svg';
                });
            });

            star.addEventListener('mouseout', () => {
                stars.forEach((s, i) => {
                    s.src = i < selectedRating ? '/images/rate-star.svg' : '/images/rate-stroke.svg';
                });
            });

            star.addEventListener('click', () => {
                selectedRating = index + 1;
                stars.forEach((s, i) => {
                    s.src = i < selectedRating ? '/images/rate-star.svg' : '/images/rate-stroke.svg';
                });
            });
        });
    });

    //review form logic 
    const reviewForm = document.querySelector('.review-form');
    const reviewMsg = document.getElementById('review-msg');
    const readNowBtn = document.getElementById('read-now');
    const readPastBtn = document.getElementById('read-past');
    const dateInput = document.getElementById('read-date');
    const reviewText = document.getElementById('review-text');

    if (dateInput) dateInput.max = new Date().toISOString().split('T')[0];

    readNowBtn?.addEventListener('click', () => {
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
            dateInput.style.display = 'none';
        }
    });

    readPastBtn?.addEventListener('click', () => {
        if (dateInput) {
            dateInput.value = '';
            dateInput.style.display = 'block';
        }
    });

    reviewForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const book_id = formData.get('book_id');
        const user_read_date = formData.get('user_read_date');
        const review_content = formData.get('review_content');

        if (!user_read_date || !review_content.trim() || selectedRating === 0) {
            reviewMsg.textContent = 'Please complete all fields including a star rating.';
            return;
        }

        fetch('/submit-review', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                book_id,
                user_read_date,
                review_content: review_content.trim(),
                rating: selectedRating
            })
        })
        .then(res => res.json())
        .then(data => {
            reviewMsg.textContent = data.message;
            if (data.success) {
                // Instead of manually updating the DOM, refresh the page
                window.location.reload();
            }
        })

        .catch(err => {
            console.error('Error:', err);
            reviewMsg.textContent = 'An error occurred. Please try again.';
        });
    });

});

//bookmark toggle between add and remove state 
document.addEventListener('DOMContentLoaded', () => {
    const bookmarkIcon = document.querySelector('.bookmark-icon');
    const tooltip = document.querySelector('.bookmark-tooltip');

    if (bookmarkIcon && tooltip) {
        const bookId = bookmarkIcon.getAttribute('data-bookid');
        const dataLoggedIn = bookmarkIcon.getAttribute('data-loggedin');
        const isLoggedIn = dataLoggedIn === 'true';
        const isFilled = bookmarkIcon.src.includes('bookmark.svg') && !bookmarkIcon.src.includes('stroke');

        console.log('Login status:', isLoggedIn);
        console.log('Bookmark filled:', isFilled);

        // Set initial tooltip text based on login status and bookmark state
        if (!isLoggedIn) {
            tooltip.textContent = 'Log in to save';
        } else {
            tooltip.textContent = isFilled ? 'Remove from library' : 'Save to library';
        }

        bookmarkIcon.addEventListener('click', () => {
            // Only proceed if user is logged in
            if (!isLoggedIn) {
                // redirect to log in page
                window.location.href = '/login';
                return;
            }
            
            const currentIsFilled = bookmarkIcon.src.includes('bookmark.svg') && !bookmarkIcon.src.includes('stroke');
            const url = currentIsFilled ? '/remove-from-library' : '/add-to-library';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: bookId })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const newIsFilled = !currentIsFilled;
                    bookmarkIcon.src = newIsFilled
                        ? '/images/bookmark.svg'
                        : '/images/bookmark-stroke.svg';
                    
                    // Update tooltip text after state change
                    tooltip.textContent = newIsFilled ? 'Remove from library' : 'Save to library';
                } else {
                    alert(data.message || 'Action failed.');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Something went wrong.');
            });
        });
    }
});


//toggle selected hover state for read date buttons 
const readNowButton = document.getElementById('read-now');
const readPastButton = document.getElementById('read-past');

if (readNowButton) {
    readNowButton.addEventListener('click', () => {
        readNowButton.classList.add('selected');
        if (readPastButton) readPastButton.classList.remove('selected');
    });
}

if (readPastButton) {
    readPastButton.addEventListener('click', () => {
        readPastButton.classList.add('selected');
        if (readNowButton) readNowButton.classList.remove('selected');
    });
}