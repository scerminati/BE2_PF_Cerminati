export async function emailBody(user, products, amount, code) {
  // Función para formatear como moneda
  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  // Crear las filas dinámicamente con los productos
  const productRows = products
    .map((product) => {
      return `
          <tr>
            <td style="text-align: center;">${product.title}</td>
            <td style="text-align: center;">${product.quantity}</td>
            <td style="text-align: center;">${formatCurrency(
              product.price
            )}</td>
            <td style="text-align: center;">${formatCurrency(
              product.totalProduct
            )}</td>
          </tr>
        `;
    })
    .join("");

  let body = {
    from: '"So Games - Tienda de Juegos Online" <so@games.com>',
    to: user.email,
    subject: `SoGames - Detalle de tu compra`,
    html: `
          <div>
            <h1 style="text-align: center;">¡Gracias por tu compra, ${
              user.first_name
            }!</h1>
            <p>
              El día de hoy realizaste una compra en SoGames, tienda de juegos de mesa
              online. La compra ha sido exitosa y la estamos procesando. A continuación están los detalles de tu compra.
            </p>
    
            <h2>Ticket Number - ${code}</h2>
    
            <table style="width: 100%; border-collapse: collapse; margin: 0 auto;">
              <thead>
                <tr>
                  <th style="text-align: center; border-bottom: 2px solid #ddd;">Producto</th>
                  <th style="text-align: center; border-bottom: 2px solid #ddd;">Cantidad</th>
                  <th style="text-align: center; border-bottom: 2px solid #ddd;">Precio</th>
                  <th style="text-align: center; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>
    
            <h3>Monto Total: ${formatCurrency(amount)}</h3>
  
            <p>Pronto recibirás otro correo con los detalles del envío.</p>
  
            <p>El Equipo de SoGames</p>
          </div>
        `,
  };

  console.log(body);
  return body;
}
