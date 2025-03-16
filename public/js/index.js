const preferencesAlert = document.getElementsByClassName('preferences-success-alert')[0];
const closePreferencesAlert = document.getElementsByClassName('close-preferences-success-alert')[0];

closePreferencesAlert.addEventListener('click', () => {
    preferencesAlert.classList.add('hidden-msg');
});

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);

    if (params.get("preferencesSaved") === "true") {
        console.log('Preferences saved');
        preferencesAlert.classList.remove('hidden-msg');
        history.replaceState({}, document.title, window.location.pathname);
    }
});

//books carousel mouse hover and manual scrolling