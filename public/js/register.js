// Select error message and close alert button
const errorMsg = document.getElementsByClassName('error')[0];
const closeAlert = document.getElementsByClassName('close-alert')[0];

// Get the base URL from the environment
const BASE_URL = window.location.origin;

/**
 * Closes the error alert when the close button is clicked.
 * @input - Click event on the close button.
 * @output - Adds 'hidden-msg' class to hide the alert.
 */
closeAlert.addEventListener('click', () => {
    errorMsg.classList.add('hidden-msg');
});

// Register form submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form input values
    const first_name = e.target.elements.first_name.value;
    const last_name = e.target.elements.last_name.value;
    const username = e.target.elements.username.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const password_confirm = e.target.elements.confirm_password.value;

    const saveBtn = document.getElementById('continue-registration');

    console.log(password, password_confirm);

    /**
     * Displays an error message and shakes the button.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        errorMsg.querySelector('span').textContent = message;
        errorMsg.classList.remove('hidden-msg');
        
        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);
    }

    // Form validation
    if (!first_name || !last_name || !username || !email || !password || !password_confirm) {
        showError("Please, fill in all the fields.");
        return;
    }

    if (username.length < 3) {
        showError("Username must be at least 3 characters long.");
        return;
    }

    if (first_name.length < 2) {
        showError("First name must be at least 2 characters long.");
        return;
    }

    if (last_name.length < 2) {
        showError("Last name must be at least 2 characters long.");
        return;
    }

    if (!email.includes('@')) {
        showError("Please, enter a valid email address.");
        return;
    }

    if (password.length < 8) {
        showError("Password must be at least 8 characters long.");
        return;
    }

    if (password !== password_confirm) {
        showError("Passwords do not match.");
        return;
    }

    console.log("Sending data:", JSON.stringify({ first_name, last_name, username, email, password }));

    /**
     * Sends the registration request to the server.
     * @input - JSON object containing user registration data.
     * @output - Server response with status and potential redirect URL.
     */
    const res = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ first_name, last_name, username, email, password })
    });

    // Handle response
    if (!res.ok) {
        showError("Something went wrong during the registration process. Please check all the details.");
        return;
    }
    
    errorMsg.classList.add('hidden-msg');

    // Parse response and redirect if necessary
    const resJson = await res.json();
    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});
