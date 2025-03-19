const errorMsg = document.getElementsByClassName('error')[0];
const closeAlert = document.getElementsByClassName('close-alert')[0];

closeAlert.addEventListener('click', () => {
    errorMsg.classList.add('hidden-msg');
});


document.getElementById('register-form').addEventListener('submit', async(e)=> {
    e.preventDefault();
    
    const first_name = e.target.elements.first_name.value;
    const last_name = e.target.elements.last_name.value;
    const username = e.target.elements.username.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const password_confirm = e.target.elements.confirm_password.value;

    const saveBtn = document.getElementById('continue-registration');

    console.log(password, password_confirm);

    if (first_name ==="" || last_name===""  || username ==="" || email===""  || password ==="" || password_confirm==="" ) {
        errorMsg.querySelector('span').textContent = "Please, fill in all the fields.";
        errorMsg.classList.remove('hidden-msg');

        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);
        return;
    }

    if (username.length < 3) {
        errorMsg.querySelector('span').textContent = "Username must be at least 3 characters long.";

        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);

        errorMsg.classList.remove('hidden-msg');
        return;
    }

    if (first_name.length < 2) {
        errorMsg.querySelector('span').textContent = "First name must be at least 2 characters long.";

        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);

        errorMsg.classList.remove('hidden-msg');
        return;
    }

    if (last_name.length < 2) {
        errorMsg.querySelector('span').textContent = "Last name must be at least 2 characters long.";

        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);

        errorMsg.classList.remove('hidden-msg');
        return;
    }

    if (!email.includes('@')) {
        errorMsg.querySelector('span').textContent = "Please, enter a valid email address.";

        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);

        errorMsg.classList.remove('hidden-msg');
        return;
    }

    if (password.length < 8) {
        errorMsg.querySelector('span').textContent = "Password must be at least 8 characters long.";

        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);

        errorMsg.classList.remove('hidden-msg');
        return;
    }

    if (password !== password_confirm) {
        errorMsg.querySelector('span').textContent = "Passwords do not match.";

        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);

        errorMsg.classList.remove('hidden-msg');
        return;
    }

    console.log("Sending data:", JSON.stringify({ first_name, last_name, username, email, password }));

    const res = await fetch('http://127.0.0.1:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify
        ({ first_name, last_name, username, email, password })
    });

    if (!res.ok) {
        errorMsg.querySelector('span').textContent = "Something went wrong during the registration process. Please check all the details.";

        saveBtn.classList.add('shake');
        setTimeout(() => {
            saveBtn.classList.remove('shake');
        }, 500);

        errorMsg.classList.remove('hidden-msg');
        return;
    }
    
    errorMsg.classList.add('hidden-msg');
    
   const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});
