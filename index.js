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

    const btnCarrito = document.getElementById("btn-carrito");
    const btnLogout = document.getElementById("btn-logout");

    if (btnCarrito) {
        btnCarrito.addEventListener("click", function () {
            window.location.href = "carrito.html"; 
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    // cargar los productos
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

                // Botones add del carrito
                const addToCartButtons = document.querySelectorAll(".agregar-carrito-btn");
                addToCartButtons.forEach((button) => {
                    button.addEventListener("click", function () {
                        alert("Producto agregado al carrito");
                    });
                });
            })
            .catch((error) => {
                productosContainer.innerHTML = "<p>Error al cargar los productos. Por favor, inténtalo de nuevo.</p>";
                console.error("Error al obtener los productos:", error);
            });
    }

    // carga de las categorias
    botonesCategorias.forEach((boton) => {
        boton.addEventListener("click", function () {
            const categoria = this.dataset.category;
            cargarProductosPorCategoria(categoria);
        });
    });

    // carga de los carritos
    const cartList = document.getElementById("cart-list");

    if (cartList) {
        const apiUrlCarritos = `https://fakestoreapi.com/carts/user/1`;

        fetch(apiUrlCarritos)
            .then((response) => response.json())
            .then((carritos) => {
                carritos.forEach((carrito, index) => {
                    const fecha = new Date(carrito.date).toLocaleDateString();
                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${fecha}</td>
                            <td><a href="verCarrito.html?cartId=${carrito.id}">Ver</a></td>
                        </tr>
                    `;
                    cartList.innerHTML += row;
                });
            })
            .catch((error) => {
                console.error("Error al cargar los carritos:", error);
            });
    }

    // ver carrito
    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get("cartId");

    if (cartId) {
        const detalleCarrito = document.getElementById("detalle-carrito");
        const totalPagarElement = document.getElementById("total-pagar");
        let totalPagar = 0;
        const btnActualizar= this.getElementById("btn-actualizar");
        const btnConfirmar= this.getElementById("btn-confirmar");
        const btnSeguirComprando= this.getElementById("btn-seguir");
        
        if (btnActualizar) {

            btnActualizar.addEventListener("click", function() {
                window.location.href="carrito.html";
            });
        }

        if(btnConfirmar){
            btnConfirmar.addEventListener("click", function(){
                alert("pedido confirmado");
            })
        }

        if(btnSeguirComprando){
            btnSeguirComprando.addEventListener("click", function(){
                window.location.href="tienda.html";
            })
        }


        fetch(`https://fakestoreapi.com/carts/${cartId}`)
            .then((response) => response.json())
            .then((cartDetails) => {
                const products = cartDetails.products;

                products.forEach((producto) => {
                    // obtener detalles
                    fetch(`https://fakestoreapi.com/products/${producto.productId}`)
                        .then((response) => response.json())
                        .then((productDetails) => {
                            const subtotal = (producto.quantity * productDetails.price).toFixed(2);
                            totalPagar += parseFloat(subtotal); // aca el total

                            const row = `
                                <tr>
                                    <td>${productDetails.title}</td>
                                    <td>${producto.quantity}</td>
                                    <td>$${productDetails.price.toFixed(2)}</td>
                                    <td>$${subtotal}</td>
                                </tr>
                            `;
                            detalleCarrito.innerHTML += row;

                            // actualiza total
                            totalPagarElement.textContent = totalPagar.toFixed(2);
                        });
                });
            })
            .catch((error) => {
                console.error("Error al obtener los detalles del carrito:", error);
            });
    }
});
