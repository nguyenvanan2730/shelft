/**
 * Periodically checks if the user's email has been verified.
 * If verified, redirects them to the new user form page.
 */
async function checkVerification() {
    try {
        console.log("Checking verification status...");

        const res = await fetch('/api/check-verification', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await res.json();
        console.log("Server Response:", data);
        console.log("Verification status:", data.verified);

        if (data.verified) {
            console.log("Verified! Redirecting...");
            window.location.href = "/new-user-form";
        } else {
            console.log("Not verified yet. Waiting...");
        }
    } catch (error) {
        console.error("Error checking verification status:", error);
    }
}

// Reenvío del email de verificación
window.addEventListener('DOMContentLoaded', () => {
    const resendLink = document.getElementById('resend-link');

    if (resendLink) {
        resendLink.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                const res = await fetch('/api/resend-verification', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (!res.ok) {
                    const contentType = res.headers.get("content-type");
                    let errorMessage = "Something went wrong while resending the email.";

                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await res.json();
                        errorMessage = errorData.message || errorMessage;
                    }

                    alert("❌ " + errorMessage);
                    return;
                }

                alert("✅ We've resent the verification email. Please check your inbox!");
            } catch (err) {
                console.error("❌ Network or server error:", err);
                alert("❌ Something went wrong while resending the email.");
            }
        });
    }
});

// Comprobación periódica cada 5 segundos
setInterval(checkVerification, 5000);