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

  async getTicketsFromUser(user) {
    return await this.dao.findByUser(user);
  }

  async createTicket(user, cart) {
    return await this.dao.create(user,cart);
  }

  async editTicket(id, status) {
    return await this.dao.edit(id, status);
  }

    async populateTicket(id) {
    return await this.dao.populate(id);
  }

}
