document.getElementsByTagName('button')[0].addEventListener('click', ()=>{
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.location.href = '/';
});