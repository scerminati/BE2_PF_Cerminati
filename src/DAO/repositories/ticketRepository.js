export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllTickets() {
    return await this.dao.find();
  }

  async getTicket(id) {
    return await this.dao.findById(id);
  }

  async getTicketsFromUser(id) {
    return await this.dao.findByUser(id);
  }

  async createTicket(data) {
    return await this.dao.create(data);
  }

  async editTicket(id, status) {
    return await this.dao.edit(id, status);
  }

  async populateTicket(id) {
    return await this.dao.populate(id);
  }
}
