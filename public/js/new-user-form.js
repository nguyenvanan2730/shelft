// Select error and success alert elements
const errorMsg = document.getElementsByClassName('error-alert')[0];
const closeErrorAlert = document.getElementsByClassName('close-error-alert')[0];
const alert = document.getElementsByClassName('success-alert')[0];
const closeAlert = document.getElementsByClassName('close-success-alert')[0];

/**
 * Closes the error alert when the close button is clicked.
 * @input - Click event on the error close button.
 * @output - Hides the error message by adding the 'hidden-msg' class.
 */
closeErrorAlert.addEventListener('click', () => {
  errorMsg.classList.add('hidden-msg');
});

/**
 * Closes the success alert when the close button is clicked.
 * @input - Click event on the success close button.
 * @output - Hides the success message by adding the 'hidden-msg' class.
 */
closeAlert.addEventListener('click', () => {
  alert.classList.add('hidden-msg');
});

/**
 * Automatically hides the success alert after 5 seconds.
 * @input - None.
 * @output - Adds 'hidden-msg' class to hide the alert.
 */
setTimeout(() => {
  alert.classList.add('hidden-msg');
}, 5000);

document.addEventListener('DOMContentLoaded', () => {
    // =======================
    // Genre Selection
    // =======================
    
    let selectedGenres = 0;
    const maxGenres = 4;
    const genreCards = document.querySelectorAll('.genre-card');
    const saveBtn = document.getElementById('save-preferences');

    /**
     * Handles genre selection.
     * - Allows up to 4 genres to be selected.
     * - Clicking an already selected genre deselects it.
     * 
     * @input - Click event on a genre card.
     * @output - Toggles the 'selected' class on the genre card.
     */
    genreCards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('selected')) {
          // Deselect genre
          card.classList.remove('selected');
          selectedGenres--;
        } else {
          // Select genre (only if within limit)
          if (selectedGenres < maxGenres) {
            card.classList.add('selected');
            selectedGenres++;
          } 
        }
      });
    });

    // =======================
    // Frequency Selection
    // =======================
    
    const freqCards = document.querySelectorAll('.frequency-card');

    /**
     * Handles frequency selection.
     * - Ensures only one frequency option is selected at a time.
     * 
     * @input - Click event on a frequency card.
     * @output - Deselects all frequency cards, selects the clicked one.
     */
    freqCards.forEach(card => {
      card.addEventListener('click', () => {
        // Deselect all frequency cards
        freqCards.forEach(f => f.classList.remove('selected'));
        // Select clicked frequency
        card.classList.add('selected');
      });
    });

    // =======================
    // Save Preferences
    // =======================

    /**
     * Handles saving preferences when the button is clicked.
     * - Gathers selected genres and frequency.
     * - Sends data to the server via a POST request.
     * - Shows alerts on success/failure.
     * 
     * @input - Click event on the save button.
     * @output - Redirects to homepage on success, shows an error alert on failure.
     */
    document.getElementById('save-preferences').addEventListener('click', async () => {
      // 1. Get selected genres
      const selectedGenreIds = [];
      document.querySelectorAll('.genre-card.selected').forEach(card => {
        const genreId = card.getAttribute('data-genre');
        selectedGenreIds.push(Number(genreId));
      });

      // If no genre is selected, show an error and prevent submission
      if (selectedGenreIds.length === 0) {
        errorMsg.querySelector('span').textContent = "Please select at least one genre.";
        errorMsg.classList.remove('hidden-msg');
        alert.classList.add('hidden-msg');
        
        // Add shake animation to the button
        saveBtn.classList.add('shake');
        setTimeout(() => {
          saveBtn.classList.remove('shake');
        }, 500);

        // Scroll to the top to display the error message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 2. Get selected frequency
      let frequencyValue = 0;
      const selectedFreq = document.querySelector('.frequency-card.selected');
      if (selectedFreq) {
        frequencyValue = Number(selectedFreq.getAttribute('data-freq'));
      }

      // 3. Send data to server
      const res = await fetch('/api/save-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frequency: frequencyValue,
          genres: selectedGenreIds
        })
      });

      // Handle response
      if (res.ok) {
        // Redirect to homepage with success flag
        window.location.href = "/?preferencesSaved=true";
      } else {
        // Show error alert
        errorMsg.querySelector('span').textContent = "Something went wrong saving your preferences.";
        errorMsg.classList.remove('hidden-msg');
        alert.classList.add('hidden-msg');

        // Add shake animation to the button
        saveBtn.classList.add('shake');
        setTimeout(() => {
          saveBtn.classList.remove('shake');
        }, 500);

        // Scroll to the top to display the error message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
});
