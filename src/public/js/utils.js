//Get Card Id para el proyecto, solamente adquiere el ID del cart, pero se puede obtener todos los datos de sesión del usuario.

const getCartId = async () => {
  console.log("ok");
  try {
    const response = await fetch("../api/sessions/cartLink", {
      method: "GET",
      credentials: "include",
    });

    console.log(response);

    // Verifica si la respuesta es HTML en lugar de JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const html = await response.text(); // Lee la respuesta como texto
      console.error("Error: Se devolvió HTML en lugar de JSON", html);
      return null;
    }

    if (!response.ok) {
      console.log("Usuario no logueado");
      return null;
    }

    const data = await response.json(); // Si es JSON válido, lo parsea
    console.log(data, "DATA");
    return data.payload;
  } catch (error) {
    console.error("Error de servidor:", error.message);
  }
};

//Función de cantidad total en el carrito para obtener el cart count.
const getQT = async () => {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) {
    console.error("El elemento cartCount no existe en el DOM");
    return;
  }
  const cartId = await getCartId();
  if (cartId) {
    try {
      const response = await fetch(`/api/carts/${cartId}/QT`);
      if (response && response.ok) {
        let { payload: data } = await response.json();
        cartCount.innerText = data;
      } else {
        console.error(`Error al cargar QT: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  } else if (cartCount) {
    cartCount.innerText = 0;
  }
};

// Función para actualizar el enlace del carrito
const updateLink = async () => {
  const cartId = await getCartId();
  const cartLink = document.getElementById("cartLink");
  if (cartLink) {
    if (cartId) {
      cartLink.href = `/carts/${cartId}`;
      getQT();
    } else {
      cartLink.href = `/login`;
    }
  }
};

//Tostify alerts para todo el proyecto, se carga en main.handlebars.

function tostada(texto) {
  Toastify({
    text: texto,
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#cc7f53",
      color: "black",
    },
  }).showToast();
}
