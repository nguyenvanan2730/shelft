// book detail page rate and review dynamic functionalities 

document.addEventListener('DOMContentLoaded', () => {
    let selectedRating = 0;

    //star rating logic
    document.querySelectorAll('.rating-stars').forEach(starContainer => {
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
                console.log('Review data:', data.review);
                reviewForm.reset();
                dateInput.style.display = 'none';
                selectedRating = 0;
                document.querySelectorAll('.star').forEach(s => {
                    s.src = '/images/rate-stroke.svg';
                });

                //load reviews
                if (data.success && data.review && typeof data.review.rating !== 'undefined') {
                    const reviewSection = document.querySelector('.review-section');
                  
                    const stars = Array.from({ length: 5 }, (_, i) => {
                      return i < data.review.rating
                        ? `<img class="star" src="/images/rate-star.svg" alt="filled star" />`
                        : `<img class="star" src="/images/rate-stroke.svg" alt="filled star" />`;
                    }).join('');
                  
                    const reviewHtml = `
                      <div class="review">
                        <strong>${data.review.username}</strong>
                        <div class="rating-stars-static">${stars}</div>
                        <p>${data.review.review_content}</p>
                        <span class="date">${new Date(data.review.created_at).toLocaleDateString()}</span>
                      </div>
                    `;
                  
                    reviewSection.insertAdjacentHTML('afterbegin', reviewHtml);
                  } else {
                    console.warn('Unexpected response structure:', data);
                  }
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
        const isLoggedIn = bookmarkIcon.getAttribute('data-loggedin')?.toLowerCase() === 'true';

        const updateTooltip = () => {
            const isFilled = bookmarkIcon.src.includes('bookmark.svg');
            if (!isLoggedIn) {
                tooltip.textContent = 'Log in to save';
            } else {
                tooltip.textContent = isFilled ? 'Remove from library' : 'Save to library';
            }
        };

        updateTooltip(); // initial

        bookmarkIcon.addEventListener('click', () => {
            const isFilled = bookmarkIcon.src.includes('bookmark.svg');
            const url = isFilled ? '/remove-from-library' : '/add-to-library';

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
                    bookmarkIcon.src = isFilled
                        ? '/images/bookmark-stroke.svg'
                        : '/images/bookmark.svg';
                    updateTooltip(); // refresh tooltip message
                } else {
                    alert(data.message || 'Action failed.');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Something went wrong.');
            });
        });

        bookmarkIcon.addEventListener('mouseenter', updateTooltip);
    }
});