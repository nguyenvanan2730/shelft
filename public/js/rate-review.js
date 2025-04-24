// book detail page rate and review dynamic functionalities 

document.querySelectorAll('.rating-stars').forEach(starContainer => {
    const stars = starContainer.querySelectorAll('.star');
    const bookId = starContainer.dataset.bookid;

    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            stars.forEach((s,i) => {
                s.src = i <= index ? '/images/rate-star.svg' : '/images/rate-stroke.svg';
            });
        });

        star.addEventListener('mouseout', () => {
            stars.forEach((s) => s.src ='/images/rate-stroke.svg');
        });

        star.addEventListener('click', () => {
            const rating = index + 1;
            fetch('/rate-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookId, rating })
            })
            .then(res => res.json())
            .then(data => alert(data.message))
            .catch(err => console.error('Error:', err));
        });
    });
});

// Review form logic
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.querySelector('.review-form');
    const reviewMsg = document.getElementById('review-msg');
    const readNowBtn = document.getElementById('read-now');
    const readPastBtn = document.getElementById('read-past');
    const dateInput = document.getElementById('read-date');
    const reviewText = document.getElementById('review-text');

    // Set max date
    if (dateInput) {
        dateInput.max = new Date().toISOString().split('T')[0];
    }

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

        if (!user_read_date || !review_content.trim()) {
            reviewMsg.textContent = 'Please select a read date and write your review.';
            return;
        }

        fetch('/submit-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                book_id,
                user_read_date,
                review_content: review_content.trim()
            })
        })
        .then(res => res.json())
        .then(data => {
            reviewMsg.textContent = data.message;
            if (data.success || data.message.includes('submitted')) {
                reviewForm.reset();
                if (dateInput) {
                    dateInput.style.display = 'none';
                }
            }
        })
        .catch(err => {
            console.error('Error submitting review:', err);
            reviewMsg.textContent = 'Something went wrong. Try again later.';
        });
    });
});