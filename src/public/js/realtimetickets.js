// Conectar al servidor de Socket.io
const socket = io();

// Escuchar eventos de conexión y desconexión
socket.on("connect", () => {
  console.log("Admin conectado al servidor");
});

socket.on("disconnect", () => {
  console.log("Admin desconectado del servidor");
});

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  const ticketList = document.getElementById("listado");

  socket.on("Ticket Change", (ticketinfo) => {
    const existingTicket = document.getElementById(ticketinfo._id);

    if (!ticketinfo.readableDate) {
      const date = new Date(ticketinfo.purchase_datetime);
      const options = { day: "2-digit", month: "short", year: "numeric" };
      ticketinfo.readableDate = date
        .toLocaleDateString("es-ES", options)
        .replace(",", "");
    }

    if (existingTicket) {
      existingTicket.innerHTML = innerHTMLtext(ticketinfo);
    } else {
      // Agregar nuevo producto a la lista
      const newTicketItem = document.createElement("div");

      newTicketItem.setAttribute("id", ticketinfo._id);
      newTicketItem.classList.add("productoBox");
      newTicketItem.innerHTML = innerHTMLtext(ticketinfo);
      ticketList.appendChild(newTicketItem);
    }
  });

  // document.addEventListener("click", async (event) => {
  //   if (event.target.classList.contains("btn-user")) {
  //     const userId = event.target.getAttribute("data-user-id");

  //     try {
  //       const response = await fetch(`/api/users/${userId}/makeUser`, {
  //         method: "PUT",
  //       });

  //       if (!response.ok) {
  //         tostada("Error en la respuesta del servidor.");
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       let { payload: newUser } = await response.json();

  //       // Emitir evento de eliminación de producto a través de Socket.io
  //       socket.emit("User Change", newUser);
  //       tostada("Nuevo rol de Usuario");
  //     } catch (error) {
  //       tostada("Error al cambiar el rol.");
  //       console.error("Error al cambiar de rol", error.message);
  //     }
  //   }
  // });

  // document.addEventListener("click", async (event) => {
  //   if (event.target.classList.contains("btn-admin")) {
  //     const userId = event.target.getAttribute("data-user-id");

  //     try {
  //       const response = await fetch(`/api/users/${userId}/makeAdmin`, {
  //         method: "PUT",
  //       });

  //       if (!response.ok) {
  //         tostada("Error en la respuesta del servidor.");
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       let { payload: newUser } = await response.json();

  //       // Emitir evento de eliminación de producto a través de Socket.io
  //       socket.emit("User Change", newUser);
  //       tostada("Nuevo rol de Administrador");
  //     } catch (error) {
  //       tostada("Error al cambiar el rol.");
  //       console.error("Error al cambiar de rol", error.message);
  //     }
  //   }
  // });
});

function innerHTMLtext(ticket) {
  return `<p class="flex2u">
              Código:
              ${ticket.code}
            </p>
            <p class="flex5u">Usuario: ${ticket.user.email}</p>
            <p class="flex3u">
              Total: $${ticket.amount}
            </p>
            <p class="flex2u">
              Fecha de Pedido:
              ${ticket.readableDate}
            </p>

            <p class="flex3u">Estado: ${ticket.status}</p>

            <button
              type="button"
              class="btn-user flex6u"
              data-user-id="${ticket._id}"
            >Administrar Pedido</button>
    `;
}
