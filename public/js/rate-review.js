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

//review form logic
const reviewText = document.getElementById('review-text');
const currentDateBtn = document.getElementById('read-now');
const pastDateBtn = document.getElementById('read-past');
const dateInput = document.getElementById('read-date');
const submitReviewBtn = document.getElementById('submit-review');
let selectedDate = null;

// Date picker setup
dateInput.style.display = 'none';
dateInput.max = new Date().toISOString().split('T')[0];

currentDateBtn?.addEventListener('click', () => {
    selectedDate = new Date().toISOString().split('T')[0];
    dateInput.style.display = 'none';
});

pastDateBtn?.addEventListener('click', () => {
    dateInput.style.display = 'block';
    dateInput.value = '';
    selectedDate = null;
});

dateInput?.addEventListener('change', () => {
    if (new Date(dateInput.value) > new Date()) {
        alert("Please pick a date in the past.");
        dateInput.value = '';
    } else {
        selectedDate = dateInput.value;
    }
});

//submission button 
submitReviewBtn?.addEventListener('click', () => {
    const review = reviewText?.value.trim();
    const bookId = submitReviewBtn?.dataset.bookid;

    if (!selectedDate) {
        alert("Please select when you read this book.");
        return;
    }

    if (!review) {
        alert("Please write something in your review.");
        return;
    }

    fetch('/submit-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId, review_content: review, read_date: selectedDate })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            reviewText.value = '';
            dateInput.value = '';
        }
    })
    .catch(err => console.error('Error:', err));
});