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
                reviewForm.reset();
                dateInput.style.display = 'none';
                selectedRating = 0;
                document.querySelectorAll('.star').forEach(s => {
                    s.src = '/images/rate-stroke.svg';
                });
            }
        })

        .catch(err => {
            console.error('Error:', err);
            reviewMsg.textContent = 'An error occurred. Please try again.';
        });
    });

});