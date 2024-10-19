export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllCarts() {
    return await this.dao.find();
  }
  async getCart(id) {
    return await this.dao.findById(id);
  }

  async getCartQT(id) {
    return await this.dao.QT(id);
  }

  async createCart() {
    return await this.dao.create();
  }

  async editCart(id, prod, qty) {
    return await this.dao.edit(id, prod, qty);
  }

  async emptyCart(id) {
    return await this.dao.empty(id);
  }

  async delete1Cart(id, prod) {
    return await this.dao.delete(id, prod);
  }
}
