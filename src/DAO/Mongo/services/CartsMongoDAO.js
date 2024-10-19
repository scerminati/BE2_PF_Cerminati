import cartsModel from "../models/carts.model.js";

export default class CartsMongoDAO {
  find = async () => {
    try {
      let carts = await cartsModel.find({});
      return carts ? await this.populate(carts) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  findById = async (id) => {
    try {
      let cart = await cartsModel.findOne({ _id: id });
      return cart ? await this.populate(cart) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  QT = async (id) => {
    try {
      let cart = await this.findById(id);

      if (!cart) {
        return null;
      }
      if (cart.products.length > 0) {
        const cartQT = cart.products.reduce((total, product) => {
          return total + product.quantity;
        }, 0);
        return cartQT
      } else return 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  create = async () => {
    try {
      return await cartsModel.create({
        id: await this.nextId(),
        products: [],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  edit = async (id, idprod, qty) => {
    try {
      let cart = await this.findById(id);
      let prodIndex = cart.products.findIndex(
        (prod) => prod.product._id.toString() === idprod
      );
      console.log("prod que estoy buscando", cart);
      if (prodIndex !== -1) {
        // Si el producto existe, actualiza la cantidad
        cart.products[prodIndex].quantity = qty;
      } else {
        // Si no existe, lo añade
        cart.products.push({ product: idprod, quantity: qty });
      }

      let cartUpdated = await cartsModel.findOneAndUpdate(
        { _id: id },
        { products: cart.products },
        {
          new: true,
        }
      );
      return cartUpdated ? await this.populate(cartUpdated) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  empty = async (id) => {
    try {
      let cart = await this.findById(id);
      if (cart) {
        cart.products = [];
        let updatedCart = await cartsModel.findOneAndUpdate({ _id: id }, cart, {
          new: false,
        });
        return updatedCart ? await this.populate(updatedCart) : null;
      } else return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  delete = async (id, prod) => {
    try {
      console.log("idProd", prod);
      let cart = await this.findById(id);
      if (cart) {
        let product = cart.products.find(
          (prodCarrito) => prodCarrito.product._id.toString() === prod
        );

        if (!product) return 1;
        console.log("producto a borrar", product);
        cart.products = cart.products.filter(
          (productToDelete) => productToDelete.product._id.toString() !== prod
        );
        console.log("cart productos filtrado", cart.products);
        let updatedCart = await cartsModel.findOneAndUpdate(
          { _id: id },
          { products: cart.products },
          {
            new: false,
          }
        );

        return updatedCart? await this.populate(updatedCart) : null
      } else return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
