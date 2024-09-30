document.addEventListener("DOMContentLoaded", function () {
    // Validación de credenciales para el formulario de login
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            // Validación con credenciales fijas
            if (username === "mor_2314" && password === "83r5^_") {
                window.location.href = "tienda.html";
            } else {
                alert("Usuario o contraseña invalida");
            }
        });
    }

    // Simulación de usuario logueado (ID 2)
    const userId = 2;
    let carritoId = null; // Variable para almacenar el ID del carrito actual

    // Cargar productos por categoría (para tienda.html)
    const botonesCategorias = document.querySelectorAll(".categoria-btn");
    const productosContainer = document.querySelector(".productos-container");

    // Función para cargar productos según la categoría
    function cargarProductosPorCategoria(categoria) {
        const apiUrl = `https://fakestoreapi.com/products/category/${categoria}`;

        productosContainer.innerHTML = "<p>Cargando productos...</p>";

        fetch(apiUrl)
            .then((response) => response.json())
            .then((productos) => {
                productosContainer.innerHTML = "";
                productos.forEach((producto) => {
                    const card = document.createElement("div");
                    card.classList.add("card");

                    card.innerHTML = `
                        <img src="${producto.image}" alt="${producto.title}">
                        <h3>${producto.title}</h3>
                        <p>$${producto.price.toFixed(2)}</p>
                        <button class="agregar-carrito-btn" data-product-id="${producto.id}">Agregar al carrito</button>
                    `;

                    productosContainer.appendChild(card);
                });

                // Asignar evento a los botones de agregar al carrito
                const addToCartButtons = document.querySelectorAll(".agregar-carrito-btn");
                addToCartButtons.forEach((button) => {
                    button.addEventListener("click", function () {
                        const productId = this.dataset.productId;
                        agregarProductoAlCarrito(productId);
                    });
                });
            })
            .catch((error) => {
                productosContainer.innerHTML = "<p>Error al cargar los productos. Por favor, inténtalo de nuevo.</p>";
                console.error("Error al obtener los productos:", error);
            });
    }

    // Cargar carritos de usuario existente o crear uno nuevo
    function obtenerCarritoDeUsuario() {
        const apiUrl = `https://fakestoreapi.com/carts/user/${userId}`;

        return fetch(apiUrl)
            .then((response) => response.json())
            .then((carritos) => {
                if (carritos.length > 0) {
                    // Si el usuario tiene carritos previos, usar el más reciente
                    const ultimoCarrito = carritos[carritos.length - 1];
                    carritoId = ultimoCarrito.id;
                    return ultimoCarrito;
                } else {
                    // Si no tiene carritos, crear uno nuevo
                    return crearNuevoCarrito();
                }
            })
            .catch((error) => {
                console.error("Error al cargar carritos del usuario:", error);
            });
    }

    // Crear nuevo carrito
    function crearNuevoCarrito() {
        const carritoData = {
            userId: userId,
            date: new Date().toISOString(),
            products: []
        };

        return fetch("https://fakestoreapi.com/carts", {
            method: "POST",
            body: JSON.stringify(carritoData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((nuevoCarrito) => {
                carritoId = nuevoCarrito.id;
                return nuevoCarrito;
            })
            .catch((error) => {
                console.error("Error al crear nuevo carrito:", error);
            });
    }

    // Agregar productos al carrito existente
    function agregarProductoAlCarrito(productId) {
        if (!carritoId) {
            // Si no tenemos un carritoId, obtenemos o creamos uno
            obtenerCarritoDeUsuario().then(() => {
                // Luego de obtener o crear el carrito, agregamos el producto
                actualizarCarrito(productId);
            });
        } else {
            // Si ya tenemos un carritoId, simplemente agregamos el producto
            actualizarCarrito(productId);
        }
    }

    // Función para actualizar el carrito con un nuevo producto
    function actualizarCarrito(productId) {
        // Obtener los detalles del carrito actual
        fetch(`https://fakestoreapi.com/carts/${carritoId}`)
            .then((response) => response.json())
            .then((carrito) => {
                // Verificar si el producto ya existe en el carrito
                const productoExistente = carrito.products.find(p => p.productId == productId);

                if (productoExistente) {
                    // Si el producto ya existe, aumentar su cantidad
                    productoExistente.quantity += 1;
                } else {
                    // Si no existe, agregarlo al carrito
                    carrito.products.push({ productId: productId, quantity: 1 });
                }

                // Actualizar carrito en la API
                return fetch(`https://fakestoreapi.com/carts/${carritoId}`, {
                    method: "PUT",
                    body: JSON.stringify(carrito),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            })
            .then(response => response.json())
            .then(data => {
                alert("Producto agregado al carrito.");
                console.log("Carrito actualizado:", data);
            })
            .catch((error) => {
                console.error("Error al actualizar el carrito:", error);
            });
    }

    // Inicializar la tienda cargando productos por categoría
    if (botonesCategorias) {
        botonesCategorias.forEach((boton) => {
            boton.addEventListener("click", function () {
                const categoria = this.dataset.category;
                cargarProductosPorCategoria(categoria);
            });
        });
    }

    // Manejar navegación al carrito y logout
    const btnCarrito = document.getElementById("btn-carrito");
    if (btnCarrito) {
        btnCarrito.addEventListener("click", function () {
            window.location.href = "carrito.html";
        });
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btn
