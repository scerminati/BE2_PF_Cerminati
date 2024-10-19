import cartsModel from "../models/carts.model.js";

export default class CartsMongoDAO {
  find = async () => {
    return await cartsModel.find({});
  };

  findById = async (id) => {
    return await cartsModel.findOne({ _id: id });
  };

  create = async (data) => {
    return await cartsModel.create(data);
  };

  edit = async (id, products) => {
    return await cartsModel.findOneAndUpdate(
      { _id: id },
      { products: products },
      {
        new: true,
      }
    );
  };


  populate = async (cartpopulate) => {
    try {
      const cartsArray = Array.isArray(cartpopulate)
        ? cartpopulate
        : [cartpopulate];

      const populatedCarts = await Promise.all(
        cartsArray.map(async (cart) => {
          let populatedCart = await cart.populate({
            path: "products.product",
            select: "id title price stock",
          });

          let response = {
            ...populatedCart.toObject(),
            products: populatedCart.products.map((product) => ({
              product: product.product, // Mantiene todo el objeto del producto
              quantity: product.quantity, // Extrae la cantidad
            })),
          };
          return response;
        })
      );

      return populatedCarts.length === 1 ? populatedCarts[0] : populatedCarts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  nextId = async () => {
    try {
      const lastCart = await cartsModel.findOne({}, {}, { sort: { id: -1 } });
      return lastCart ? lastCart.id + 1 : 1;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
