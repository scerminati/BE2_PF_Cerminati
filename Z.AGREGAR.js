import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const MAILPASS = process.env.MAILPASSL;
const MAIL = process.env.MAIL;


const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: { user: MAIL, pass: MAILPASS },
});

app.get("/mail", async (req, res) => {
  let result = await transport.sendMail({
    from: "so@games.com",
    to: "sofiacermi@hotmail.com",
    subject: "[SoGames] Confirmación de Compra",
    html: `<div>Gracias por tu compra</div>`,
    attachments:[]
  });
});

//gptt hfqt rrvh kiyb

//Puppeteer

//npm i puppeteer
