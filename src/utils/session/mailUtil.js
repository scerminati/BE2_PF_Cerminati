import dotenv from "dotenv";

dotenv.config();

const MAILPASS = process.env.MAILPASS;
const MAIL = process.env.MAIL;

export let mailCofig = {
  service: "gmail",
  port: 587,
  auth: { user: MAIL, pass: MAILPASS },
};

export let body = {
  from: '"So Games - Tienda de Juegos Online" <so@games.com>',
  to: "sofiacermi@hotmail.com",
  subject: "[SoGames] Confirmación de Compra",
  html: `<div>Gracias por tu compra</div>`,
  attachments: [],
};
