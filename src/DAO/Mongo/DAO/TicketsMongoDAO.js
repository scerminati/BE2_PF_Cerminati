import ticketModel from "../models/ticket.model.js";

export default class TicketsMongoDAO {
  find = async () => {
    return await ticketModel.find({});
  };

  findById = async (id) => {
    return await ticketModel.findById(id);
  };

  findByUser = async (id) => {
    return await ticketModel.find({ user: id }).populate("products").exec();
  };

  create = async (data) => {
    return await ticketModel.create(data);
  };

  edit = async (id, status) => {};

  populate = async (id) => {};

}
