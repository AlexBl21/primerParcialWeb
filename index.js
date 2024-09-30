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
                alert("Usuario o contraseña invalida");
            }
        });
    }

    const botonesCategorias = document.querySelectorAll(".categoria-btn");
    const productosContainer = document.querySelector(".productos-container");

    // Función para cargar productos según la categoría
    function cargarProductosPorCategoria(categoria) {
        const apiUrl = `https://fakestoreapi.com/products/category/${categoria}`;

        // Limpiar el contenedor de productos
        productosContainer.innerHTML = "<p>Cargando productos...</p>";

        // Fetch para obtener los productos de la categoría
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
                        <button class="agregar-carrito-btn">Agregar al carrito</button>
                    `;

            
                    productosContainer.appendChild(card);
                });
            })
            .catch((error) => {
                productosContainer.innerHTML = "<p>Hubo un error al cargar los productos. Por favor, inténtalo de nuevo.</p>";
                console.error("Error al obtener los productos:", error);
            });
    }


    botonesCategorias.forEach((boton) => {
        boton.addEventListener("click", function () {
            const categoria = this.dataset.category;
            cargarProductosPorCategoria(categoria);
        });
    });

    const btnCarrito = document.getElementById("btn-carrito");
    const btnLogout = document.getElementById("btn-logout");

    btnCarrito.addEventListener("click", function () {
        window.location.href = "carrito.html";
    });


    btnLogout.addEventListener("click", function () {
        window.location.href = "login.html";  
    });
});