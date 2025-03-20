/**
 * Periodically checks if the user's email has been verified.
 * If verified, redirects them to the new user form page.
 * 
 * @input - No direct input, it runs automatically every 5 seconds.
 * @output - If the user is verified, they are redirected to "/new-user-form".
 */
async function checkVerification() {
    try {
        console.log("Checking verification status...");

        // Send a request to the server to check the user's verification status
        const res = await fetch('/api/check-verification', {
            method: 'GET', // Uses GET request to check the verification status
            credentials: 'include' // Ensures cookies are sent with the request
        });

        const data = await res.json(); // Parse the JSON response
        console.log("Server Response:", data);
        console.log("Verification status:", data.verified);

        // If the user is verified, redirect them to the new user form page
        if (data.verified) {
            console.log("Verified! Redirecting...");
            window.location.href = "/new-user-form";
        } else {
            console.log("Not verified yet. Waiting...");
        }
    } catch (error) {
        console.error("Error checking verification status:", error); // Catch and log any errors
    }
}

// Set an interval to check the verification status every 5 seconds
setInterval(checkVerification, 5000);
