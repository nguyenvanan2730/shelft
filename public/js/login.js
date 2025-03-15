const errorMsg = document.getElementsByClassName('error')[0];
const closeAlert = document.getElementsByClassName('close-alert')[0];

closeAlert.addEventListener('click', () => {
    errorMsg.classList.add('hidden-msg');
});

document.getElementById('login-form').addEventListener('submit', async(e)=> {
    e.preventDefault();

    const res = await fetch('http://127.0.0.1:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify
        ({
            identifier: e.target.elements.identifier.value,
            password: e.target.elements.password.value
        })
    });

    if(e.target.elements.identifier.value === "" || e.target.elements.password.value === "") {
        errorMsg.querySelector('span').textContent = "Please, fill in all the fields.";

        errorMsg.classList.remove('hidden-msg');
        return;
    }

    if (!res.ok) {
        errorMsg.querySelector('span').textContent = "The username or password entered is incorrect.";

        errorMsg.classList.remove('hidden-msg');
        return;
      }
    
      errorMsg.classList.add('hidden-msg');

    const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});