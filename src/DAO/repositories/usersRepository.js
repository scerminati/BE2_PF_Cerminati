export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllUsers() {
    return await this.dao.find();
  }

  async getUser(id) {
    return await this.dao.findById(id);
  }

  async loginUser(email, pass) {
    return await this.dao.login(email, pass);
  }

  async createUser(info) {
    return await this.dao.create(info);
  }

  async updateUserCart(id, cartId) {
    return await this.dao.edit(id, cartId);
  }

  async makeAdmin(id) {
    return await this.dao.admin(id);
  }

  async makeUser(id) {
    return await this.dao.user(id);
  }
}
