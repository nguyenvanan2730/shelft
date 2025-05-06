// Select the error message element and the close button
const errorMsg = document.getElementsByClassName('error')[0];
const closeAlert = document.getElementsByClassName('close-alert')[0];

// Get the base URL from the environment
const BASE_URL = window.location.origin;

// Password Reset Modal Logic
const forgotLink = document.querySelector('.login-forgotten-password');
const modal = document.getElementById('reset-password-modal');
const modalOverlay = document.querySelector('.modal-overlay');
const closeModalBtn = document.querySelector('.close-modal');

// Open modal
forgotLink?.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden-modal');
});

// Close modal
const closeModal = () => {
    modal.classList.add('hidden-modal');
};

closeModalBtn?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);

// Prevent closing when clicking inside the box
document.querySelector('.modal-box')?.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Handle reset form
document.getElementById('reset-password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.reset_email.value;

    try {
        const res = await fetch('/api/request-password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        if (res.ok) {
            alert('✅ Password reset link sent. Check your inbox!');
            closeModal();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('❌ Error sending reset link');
    }
});

/**
 * Closes the error alert when the close button is clicked.
 * @input - Click event on the close button.
 * @output - Hides the error message by adding the 'hidden-msg' class.
 */
closeAlert.addEventListener('click', () => {
    errorMsg.classList.add('hidden-msg');
});

/**
 * Handles the login form submission.
 * - Prevents default form submission.
 * - Sends a POST request to the login API.
 * - Displays error messages for missing fields or incorrect credentials.
 * - Redirects to the user page on successful login.
 * 
 * @input - Form submission event.
 * @output - Sends login request, displays errors if any, or redirects upon success.
 */
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Send login request
    const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensures cookies are included in the request
        body: JSON.stringify({
            identifier: e.target.elements.identifier.value, // Email or username
            password: e.target.elements.password.value
        })
    });

    /**
     * Validates if all fields are filled before making the request.
     * @input - Form fields.
     * @output - Shows an error message if any field is empty.
     */
    if (e.target.elements.identifier.value === "" || e.target.elements.password.value === "") {
        errorMsg.querySelector('span').textContent = "Please, fill in all the fields.";
        errorMsg.classList.remove('hidden-msg');
        return;
    }

    /**
     * Handles login errors (e.g., wrong username/password).
     * @input - API response.
     * @output - Displays an error message if credentials are incorrect.
     */
    if (!res.ok) {
        errorMsg.querySelector('span').textContent = "The username or password entered is incorrect.";
        errorMsg.classList.remove('hidden-msg');
        return;
    }

    // Hide error message if login is successful
    errorMsg.classList.add('hidden-msg');

    // Parse the response
    const resJson = await res.json();

    /**
     * Redirects the user upon successful login.
     * @input - API response with redirect URL.
     * @output - Redirects the user to the specified page.
     */
    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});
