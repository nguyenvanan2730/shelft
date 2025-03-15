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
        }else{
            console.log("❌ Not verified yet. Waiting...");
        }
    } catch (error) {
        console.error("Error checking verification status:", error);
    }
}

setInterval(checkVerification, 5000);