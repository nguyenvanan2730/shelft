const errorMsg = document.getElementsByClassName('error')[0];

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
    if(!res.ok) return errorMsg.classList.toggle('hidden-msg', false);
    const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});