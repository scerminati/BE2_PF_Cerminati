// Conectar al servidor de Socket.io
const socket = io();

// Escuchar eventos de conexión y desconexión
socket.on("connect", () => {
  console.log("Cliente conectado al servidor");
});

socket.on("disconnect", () => {
  console.log("Cliente desconectado del servidor");
});

// Escuchar actualizaciones de productos desde el servidor
socket.on("Cart Update", (updatedCart) => {
  //console.log("Carrito actualizado:", updatedCart);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    getQT();
  }
});

// Función para actualizar el enlace del carrito

// Función para agregar un producto al carrito
const addToCart = async (productId) => {
  const cartId = await getCartId();
  if (cartId) {
    try {
      const response = await fetch(
        `/api/carts/${cartId}/product/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (response.ok) {
        tostada("Producto agregado al carrito.");
        socket.emit("Product Update", productId);
      } else {
        throw new Error("No se pudo agregar el producto al carrito");
      }
    } catch (error) {
      console.error("Error:", error.message);
      tostada("Error al agregar el producto al carrito");
    }
  } else {
    window.location.href = "/login";
  }
};

// Escuchar el evento Product Update y actualizar la vista
socket.on("Product Update", (updatedProduct) => {
  //console.log("Producto Actualizado:", updatedProduct);

  const stockElement = document.querySelector(
    `p[data-product-ids="${updatedProduct._id}"]`
  );

  if (stockElement) {
    // Actualizar el stock en la vista
    stockElement.innerHTML = `Stock: ${updatedProduct.stock}`;

    const button = document.querySelector(
      `button[data-product-id="${updatedProduct._id}"]`
    );
    if (button) {
      if (updatedProduct.stock > 0) {
        button.classList.remove("invisible"); // Mostrar el botón si hay stock
      } else {
        button.classList.add("invisible"); // Ocultar el botón si no hay stock
      }
    }
  }
});

// Añadir eventos a los botones de "Agregar al Carrito"
document.addEventListener("DOMContentLoaded", () => {
  updateLink();

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      addToCart(productId);
    });
  });
});
