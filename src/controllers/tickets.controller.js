import {
  getAllTicketsService,
  getTicketFromUserService,
  getTicketService,
} from "../services/tickets.services.js";

import { socketServer } from "../app.js";

export const getAllTicketsController = async (req, res, next) => {
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
    next(error);
  }
};
export const getTicketController = async (req, res, next) => {
  const idTicket = req.params.cid;

  if (!idTicket || idTicket.length !== 24) {
    return next(new ValidationError("ID de ticket inválido."));
  }
  try {
    let ticket = await getTicketService(idTicket);

    return res.status(200).json({
      msg: `Mostrando ticket con id ${idTicket}`,
      payload: ticket,
    });
  } catch (error) {
    next(error);
  }
};
export const getTicketsFromUserController = async (req, res, next) => {
  const idUser = req.params.uid;
  if (!idUser || idUser.length !== 24) {
    return next(new ValidationError("ID usuario inválido."));
  }
  try {
    let ticket = await getTicketFromUserService(idUser);

    return res.status(200).json({
      msg: `Mostrando ticket del usuario ${idUser}`,
      payload: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const createTicketController = async (req, res, next) => {};

export const editTicketController = async (req, res, next) => {};
