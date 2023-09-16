//wewee//
const socket = io(); // Conéctate al servidor Socket.io

function verDetalles(productId) {
    // Enviar una solicitud para obtener los detalles del producto
    socket.emit('getProductDetails', productId);
}

socket.on('productDetails', (product) => {
    // Recibe los detalles del producto y muestra en el DOM
    mostrarDetallesEnDOM(product);
});

socket.on('productDetailsError', (errorMessage) => {
    // Manejar errores, por ejemplo, mostrar un mensaje de error
    console.error(errorMessage);
});

function mostrarDetallesEnDOM(product) {
    // Actualizar el DOM para mostrar los detalles del producto
    const detallesDiv = document.getElementById('detallesProducto');
    detallesDiv.innerHTML = `
        <h2>Detalles del Producto</h2>
        <p>Nombre: ${product.title}</p>
        <p>Descripción: ${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Categoría: ${product.category}</p>
    `;
}