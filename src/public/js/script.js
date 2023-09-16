const messagesContainer = document.getElementById('messagesContainer');

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
scrollToBottom();

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    
    const enviarMensajeButton = document.getElementById('enviarMensaje');
    const messageInput = document.getElementById('message');
    
    enviarMensajeButton.addEventListener('click', () => {
        enviarMensaje();
    });
    
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            enviarMensaje();
        }
    });
    
    function enviarMensaje() {
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        socket.emit('enviarMensaje', { email, message });
        document.getElementById('message').value = '';
    }
    
    socket.on('mensajeNuevo', (message) => {
        const messagesContainer = document.getElementById('messagesContainer');
        const newMessageDiv = document.createElement('div');
        newMessageDiv.innerHTML = `<p>${message.email}: ${message.message}</p>`;
        messagesContainer.appendChild(newMessageDiv);
        scrollToBottom();
    });
    socket.on('mensajesPrevios', (messages) => {
        messages.forEach((message) => {
            const newMessageDiv = document.createElement('div');
            newMessageDiv.innerHTML = `<p>${message.email}: ${message.message}</p>`;
            messagesContainer.appendChild(newMessageDiv);
        });
        scrollToBottom();
    });
    
});
