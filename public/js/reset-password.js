const form = document.getElementById('reset-password-form');
const errorBox = document.getElementById('reset-error');
const errorText = document.querySelector('#reset-error span');
const submitBtn = document.getElementById('reset-password-submit');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = e.target.elements.new_password.value;
    const confirmPassword = e.target.elements.confirm_password.value;
    const token = window.location.pathname.split('/').pop();

    if (!password || !confirmPassword) {
        return showError("Please, fill in all fields.");
    }

    if (password !== confirmPassword) {
        return showError("Passwords do not match.");
    }

    if (password.length < 8) {
        return showError("Password must be at least 8 characters long.");
    }

    const res = await fetch('/api/reset-password/' + token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });

    if (!res.ok) {
        const data = await res.json();
        return showError(data.message || 'An error occurred.');
    }

    alert("✅ Your password has been successfully reset!");
    window.location.href = '/login';
});

function showError(message) {
    errorText.textContent = message;
    errorBox.classList.remove('hidden-msg');
    submitBtn.classList.add('shake');
    setTimeout(() => submitBtn.classList.remove('shake'), 500);
}
