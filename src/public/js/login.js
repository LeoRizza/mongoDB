document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('#loginForm');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;


        try {
            const response = await fetch('/api/sessions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            console.log(response)

            if (response.ok) {
                console.log('Login exitoso');
                window.location.href = "/products";
            } else {
                console.error('Error en el inicio de sesión');
                window.alert('Error en el inicio de sesión. Vuelve a intentarlo.');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});
