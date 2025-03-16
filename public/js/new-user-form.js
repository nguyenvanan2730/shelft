const errorMsg = document.getElementsByClassName('error-alert')[0];
const closeErrorAlert = document.getElementsByClassName('close-error-alert')[0];

const alert = document.getElementsByClassName('success-alert')[0];
const closeAlert = document.getElementsByClassName('close-success-alert')[0];

closeErrorAlert.addEventListener('click', () => {
  errorMsg.classList.add('hidden-msg');
});

closeAlert.addEventListener('click', () => {
  alert.classList.add('hidden-msg');
});

document.addEventListener('DOMContentLoaded', () => {
    // =======================
    // Genre selection
    // =======================
    let selectedGenres = 0;
    const maxGenres = 4;
    const genreCards = document.querySelectorAll('.genre-card');
  
    genreCards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('selected')) {
          // Deselect
          card.classList.remove('selected');
          selectedGenres--;
        } else {
          // Select
          if (selectedGenres < maxGenres) {
            card.classList.add('selected');
            selectedGenres++;
          } else {
            //alert('You can only select up to 4 genres.');
          }
        }
      });
    });
  
    // =======================
    // Frequency selection
    // =======================
    const freqCards = document.querySelectorAll('.frequency-card');
    freqCards.forEach(card => {
      card.addEventListener('click', () => {
        // Deselect all
        freqCards.forEach(f => f.classList.remove('selected'));
        // Select current
        card.classList.add('selected');
      });
    });
  
    // =======================
    // Save preferences
    // =======================
    document.getElementById('save-preferences').addEventListener('click', async () => {
      // 1. Obtain selected genres
      const selectedGenreIds = [];
      document.querySelectorAll('.genre-card.selected').forEach(card => {
        const genreId = card.getAttribute('data-genre');
        selectedGenreIds.push(Number(genreId));
      });

      if (selectedGenreIds.length === 0) {
        errorMsg.querySelector('span').textContent = "Please select at least one genre.";

        errorMsg.classList.remove('hidden-msg');
        return;
      }
  
      // 2. Obtain frequency value
      let frequencyValue = 0;
      const selectedFreq = document.querySelector('.frequency-card.selected');
      if (selectedFreq) {
        frequencyValue = Number(selectedFreq.getAttribute('data-freq'));
      }
  
      // 3. Send to server
      const res = await fetch('/api/save-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frequency: frequencyValue,
          genres: selectedGenreIds
        })
      });
  
      if (res.ok) {
        // Save success
        window.location.href = "/?preferencesSaved=true";
      } else {
        errorMsg.querySelector('span').textContent = "Something went wrong saving your preferences.";

        errorMsg.classList.remove('hidden-msg');
      }
    });
  });
  