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
        localStorage.setItem("preferencesSaved", "true");
        window.location.href = "/";
      } else {
        localStorage.setItem("preferencesError", "true");
      }
    });
  });
  