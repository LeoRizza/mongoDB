const socket = io();

socket.on('productos', (productos) => {
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = '';

    productos.forEach((producto) => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `
            <h2>${producto.title}</h2>
            <p>${producto.description}</p>
            <p>Precio: $${producto.price}</p>
            <p>Categoría: ${producto.category}</p>
            <button onclick="agregarAlCarrito('${producto._id}')">Agregar al Carrito</button>
        `;
        listaProductos.appendChild(listItem);
    });
});
