// book detail page rate and review dynamic functionalities 

document.querySelectorAll('.rating-stars').forEach(starContainer => {
    const stars = starContainer.querySelectorAll('.star');
    const bookId = starContainer.dataset.bookId;

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