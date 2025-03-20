// Add an event listener to the logout button
document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        console.log("Logging out...");

        /**
         * Sends a logout request to the server.
         * @input - Click event on the logout button.
         * @output - If successful, user is redirected to the homepage and JWT cookie is cleared.
         */
        const res = await fetch('/logout', {
            method: 'GET', // Uses GET request to trigger logout route
            credentials: 'include' // Ensures cookies are sent with the request
        });

        /**
         * Checks if the response is a redirect.
         * If so, navigate to the homepage.
         */
        if (res.redirected) {
            console.log("Successfully logged out. Redirecting...");
            window.location.href = '/'; // Redirect to homepage after logout
        } else {
            console.error("Logout failed."); // If not redirected, log an error
        }
    } catch (error) {
        console.error("Error during logout:", error); // Catch and log any errors
    }
});
