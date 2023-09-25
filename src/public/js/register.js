document.addEventListener('DOMContentLoaded', function () {
    const registroForm = document.querySelector('#registroForm');

    registroForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const first_name = document.querySelector("#first_name").value;
        const last_name = document.querySelector("#last_name").value;
        const age = document.querySelector("#age").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: first_name,
                    last_name: last_name,
                    age: age,
                    email: email,
                    password: password,
                }),
            });

            console.log(response);

            if (response.ok) {
                console.log('Registro exitoso');
                window.location.href = "/home";
            } else {
                console.error('Error en el registro');
                window.alert('Error en el registro. Vuelve a intentarlo.');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});
