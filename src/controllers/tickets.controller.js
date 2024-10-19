import TicketsRepository from "../DAO/repositories/ticketRepository.js";
import { TicketsDAO } from "../DAO/DAOFactory.js";

import { socketServer } from "../app.js";

const ticketService = new TicketsRepository(TicketsDAO);

export const getAllTicketsController = async (req, res) => {};
export const getTicketController = async (req, res) => {};
export const getTicketsFromUserController = async (req, res) => {};

export const createTicketController = async (req, res) => {};

export const editTicketController = async (req, res) => {};
