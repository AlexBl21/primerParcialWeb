document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            if (username === "mor_2314" && password === "83r5^_") {
                window.location.href = "tienda.html";
            } else {
                alert("Usuario o contraseña inválida");
            }
        });
    }

    const userId = 2; 
    let carritoId = null; 

    const botonesCategorias = document.querySelectorAll(".categoria-btn");
    const productosContainer = document.querySelector(".productos-container");


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

  
    function obtenerCarritoDeUsuario() {
        const apiUrl = `https://fakestoreapi.com/carts/user/${userId}`;

        return fetch(apiUrl)
            .then((response) => response.json())
            .then((carritos) => {
                if (carritos.length > 0) {
                    const ultimoCarrito = carritos[carritos.length - 1];
                    carritoId = ultimoCarrito.id;
                    return ultimoCarrito;
                } else {
                    return crearNuevoCarrito();
                }
            })
            .catch((error) => {
                console.error("Error al cargar carritos del usuario:", error);
            });
    }


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

    // Función para agregar producto al carrito
    function agregarProductoAlCarrito(productId) {
        if (!carritoId) {
            obtenerCarritoDeUsuario().then(() => {
                actualizarCarrito(productId);
            });
        } else {
            actualizarCarrito(productId);
        }
    }

    // Función para actualizar el carrito con el producto seleccionado
    function actualizarCarrito(productId) {
        fetch(`https://fakestoreapi.com/carts/${carritoId}`)
            .then((response) => response.json())
            .then((carrito) => {
                const productoExistente = carrito.products.find(p => p.productId == productId);

                if (productoExistente) {
                    productoExistente.quantity += 1; // Incrementar la cantidad si ya existe en el carrito
                } else {
                    carrito.products.push({ productId: productId, quantity: 1 }); // Si no existe, lo agregamos
                }

                // Actualizamos el carrito en la API
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
    botonesCategorias.forEach((boton) => {
        boton.addEventListener("click", function () {
            const categoria = this.dataset.category;
            cargarProductosPorCategoria(categoria);
        });
    });

    // Manejar navegación al carrito y logout
    const btnCarrito = document.getElementById("btn-carrito");
    if (btnCarrito) {
        btnCarrito.addEventListener("click", function () {
            window.location.href = "carrito.html";
        });
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }
});
