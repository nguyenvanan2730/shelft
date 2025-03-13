const errorMsg = document.getElementsByClassName('error')[0];

document.getElementById('register-form').addEventListener('submit', async(e)=> {
    e.preventDefault();
    console.log(e.target.elements.username.value);
    const res = await fetch('http://127.0.0.1:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify
        ({
            username: e.target.elements.username.value,
            email: e.target.elements.email.value,
            password: e.target.elements.password.value
        })
    });
    if(!res.ok) return errorMsg.classList.toggle('hidden-msg', false);
    const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});
