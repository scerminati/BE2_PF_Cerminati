import {
  getAllTicketsService,
  getTicketFromUserService,
  getTicketService,
} from "../services/tickets.services.js";

import { socketServer } from "../app.js";

export const getAllTicketsController = async (req, res) => {
  let limit = parseInt(req.query.limit);
  try {
    let tickets = await getAllTicketsService(limit);

    return res.status(200).json({
      msg:
        tickets < limit
          ? `Mostrando los primeros ${limit} ickets`
          : "Mostrando todos los tickets",
      payload: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los tickets." });
  }
};
export const getTicketController = async (req, res) => {
  const idTicket = req.params.cid;

  if (!idTicket || idTicket.length !== 24) {
    return res.status(400).json({ msg: "ID de ticket inválido." });
  }
  try {
    let ticket = await getTicketService(idTicket);

    return res.status(200).json({
      msg: `Mostrando ticket con id ${idTicket}`,
      payload: ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el ticket." });
  }
};
export const getTicketsFromUserController = async (req, res) => {
  const idUser = req.params.uid;
  if (!idUser || idUser.length !== 24) {
    return res.status(400).json({ msg: "ID usuario inválido." });
  }
  try {
    let ticket = await getTicketFromUserService(idUser);

    return res.status(200).json({
      msg: `Mostrando ticket del usuario ${idUser}`,
      payload: ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los tickets." });
  }
};

export const createTicketController = async (req, res) => {};

export const editTicketController = async (req, res) => {};
