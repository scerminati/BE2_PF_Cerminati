import ticketModel from "../models/ticket.model.js";

export default class TicketsMongoDAO {
  find = async () => {
    let tickets = await ticketModel.find({});
    return tickets ? await this.populate(tickets) : null;
  };

  findById = async (id) => {
    let ticket = await ticketModel.findById(id);
    return ticket ? this.populate(ticket) : null;
  };

  findByUser = async (id) => {};

  create = async (user, cart) => {};

  edit = async (id, status) => {};

  populate = async (id) => {};
}
