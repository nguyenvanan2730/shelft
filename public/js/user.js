document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        console.log("🔄 Logging out...");

        const res = await fetch('/logout', {
            method: 'GET',
            credentials: 'include'
        });

        //document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        if (res.redirected) {
            console.log("✅ Successfully logged out. Redirecting...");
            window.location.href = '/';
        } else {
            console.error("❌ Logout failed.");
        }
    } catch (error) {
        console.error("❌ Error during logout:", error);
    }
});