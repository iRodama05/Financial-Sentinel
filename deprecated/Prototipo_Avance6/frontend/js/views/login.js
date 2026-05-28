/* Variables del formulario */
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('error-msg');

/* Evento del login */
loginForm.addEventListener('submit', async function(event){

    event.preventDefault();

    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    const respuesta = await fetch('/api/auth/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            correo:correo,
            password:password
        })
    });

    const data = await respuesta.json();

    if(respuesta.ok){

        localStorage.setItem('token_sentinel', data.token);
        localStorage.setItem('usuario_sentinel', JSON.stringify(data.usuario));

        window.location.href = '/dashboard.html';

    }else{

        errorMsg.style.display = 'block';

    }

});