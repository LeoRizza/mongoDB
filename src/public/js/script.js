const socket = io();

// Escuchar nuevos mensajes del servidor
socket.on('mensajeNuevo', (message) => {
    // Agregar el nuevo mensaje al historial de chat
    const historialChat = document.getElementById('historialChat');
    const mensajeNuevo = document.createElement('li');
    mensajeNuevo.innerHTML = `<strong>${message.email}:</strong> ${message.message}`;
    historialChat.appendChild(mensajeNuevo);
});

// Manejar el envío del formulario
const form = document.getElementById('chatForm');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    socket.emit('mensajeNuevo', { email, message });

    // Limpiar el campo de mensaje después del envío
    document.getElementById('message').value = '';
});