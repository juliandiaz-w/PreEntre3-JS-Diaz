const catalogo = [
    { id: 1, nombre: "Térmica Bipolar 2x16a", marca: "Siemens", precio: 46.212, tipo: "DIN" },
    { id: 2, nombre: "Cable 2.5mm x100 mts", marca: "Argenplas", precio: 78.513, tipo: "Rollo Unipolar" },
    { id: 3, nombre: "Lámpara LED 12w Fría", marca: "Interelec", precio: 1.438, tipo: "Iluminación" },
    { id: 4, nombre: "Cable Subterráneo 4x6mm", marca: "Argenplas", precio: 9.878, tipo: "Subterráneo" },
    { id: 5, nombre: "Tester Digital HB-118a", marca: "Brinna", precio: 57.081, tipo: "Herramienta" }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarNotificacion(mensaje, tipo = "info") {
    const notificacionesDiv = document.getElementById("notificaciones");
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

    notificacionesDiv.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

function actualizarCarrito() {
    const carritoDiv = document.getElementById("carrito");
    carritoDiv.innerHTML = carrito.length ? `<h3>Carrito de compras:</h3>` : `<h3>El carrito está vacío</h3>`;

    const template = document.getElementById("carrito-template").content;

    carrito.forEach((producto, index) => {
        const precioTotal = producto.precio * producto.cantidad;
        const carritoItem = template.cloneNode(true);

        carritoItem.querySelector(".index").textContent = index + 1;
        carritoItem.querySelector(".nombre").textContent = producto.nombre;
        carritoItem.querySelector(".marca").textContent = producto.marca;
        carritoItem.querySelector(".precio").textContent = `$${precioTotal.toFixed(3)}`;
        carritoItem.querySelector(".cantidad").textContent = `Cantidad: ${producto.cantidad}`;

        carritoItem.querySelector(".eliminar").addEventListener("click", () => eliminarDelCarrito(index));

        carritoDiv.appendChild(carritoItem);
    });
}

function mostrarCatalogo() {
    const catalogoDiv = document.getElementById("catalogo");
    const template = document.getElementById("catalogo-template").content;

    catalogo.forEach(({ id, nombre, marca, precio }) => {
        const productoDiv = template.cloneNode(true);

        productoDiv.querySelector(".id").textContent = id;
        productoDiv.querySelector(".nombre").textContent = nombre;
        productoDiv.querySelector(".marca").textContent = marca;
        productoDiv.querySelector(".precio").textContent = `$${precio.toFixed(3)}`;

        catalogoDiv.appendChild(productoDiv);
    });
}

function buscarProducto() {
    const criterio = document.getElementById("busqueda").value.toLowerCase();
    const resultados = catalogo.filter(({ nombre, marca }) =>
        nombre.toLowerCase().includes(criterio) ||
        marca.toLowerCase().includes(criterio)
    );

    const resultadoMensaje = resultados.length ? resultados.map(({ id, nombre, marca, precio }) => `
        ID: ${id}, Nombre: ${nombre}, Marca: ${marca}, Precio: $${precio.toFixed(3)}
    `).join('') : "No se encontraron productos que coincidan con el criterio de búsqueda.";

    mostrarNotificacion(resultadoMensaje);
}

function agregarAlCarrito() {
    const idProducto = parseInt(document.getElementById("productoId").value);
    const cantidadProducto = parseInt(document.getElementById("cantidadProducto").value);
    const producto = catalogo.find(({ id }) => id === idProducto);

    if (producto) {
        const productoEnCarrito = carrito.find(item => item.id === idProducto);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidadProducto;
        } else {
            carrito.push({ ...producto, cantidad: cantidadProducto });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
        mostrarNotificacion(`El producto ${producto.nombre} se agregó al carrito.`, "success");
    } else {
        mostrarNotificacion("Producto no encontrado.", "error");
    }
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    mostrarNotificacion("Producto eliminado del carrito.", "success");
}

function eliminarCantidad() {
    const idProducto = parseInt(document.getElementById("productoEliminarId").value);
    const cantidadEliminar = parseInt(document.getElementById("cantidadEliminar").value);
    const productoEnCarrito = carrito.find(item => item.id === idProducto);

    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad > cantidadEliminar) {
            productoEnCarrito.cantidad -= cantidadEliminar;
        } else {
            carrito = carrito.filter(item => item.id !== idProducto);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
        mostrarNotificacion("Cantidad de producto eliminada del carrito.", "success");
    } else {
        mostrarNotificacion("Producto no encontrado en el carrito.", "error");
    }
}

function finalizarCompra() {
    if (carrito.length) {
        const total = carrito.reduce((suma, { precio, cantidad }) => suma + (precio * cantidad), 0);
        mostrarNotificacion(`Compra finalizada. El total a pagar es: $${total.toFixed(3)}`, "success");
        carrito = [];
        localStorage.removeItem("carrito");
        actualizarCarrito();
    } else {
        mostrarNotificacion("El carrito está vacío. No hay nada que comprar.", "error");
    }
}

document.getElementById("buscarProducto").addEventListener("click", buscarProducto);
document.getElementById("agregarAlCarrito").addEventListener("click", agregarAlCarrito);
document.getElementById("eliminarDelCarrito").addEventListener("click", eliminarCantidad);
document.getElementById("finalizarCompra").addEventListener("click", finalizarCompra);

document.getElementById("busqueda").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buscarProducto();
    }
});

mostrarCatalogo();
actualizarCarrito();