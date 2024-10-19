import CartsRepository from "../DAO/repositories/cartsRepository.js";
import { CartsDAO } from "../DAO/DAOFactory.js";
import { getProductService } from "./products.services.js";

const cartService = new CartsRepository(CartsDAO);

export const getAllCartsService = async (limit) => {
  let carts = await cartService.getAllCarts();

  if (!carts) {
    throw new Error("No hay carritos para mostrar");
  }

  if (!isNaN(limit) && limit > 0) {
    carts = carts.slice(0, limit);
  }

  return await populateCartService(carts);
};

export const getCartService = async (id) => {
  let cart = await cartService.getCart(id);

  if (!cart) {
    throw new Error(`El carrito con id ${id} no exite`);
  }

  return await populateCartService(cart);
};

export const getCartQTService = async (id) => {
  let cart = await getCartService(id);
  let cartQT;
  if (cart.products.length > 0) {
    cartQT = cart.products.reduce((total, product) => {
      return total + product.quantity;
    }, 0);
  }
  return cartQT ? cartQT : 0;
};

export const createCartService = async () => {
  let nextIdC = await cartService.nextIdC();
  let data = { id: nextIdC, products: [] };

  let cart = await cartService.createCart(data);

  if (!cart) {
    throw new Error("Error al crear el carrito");
  }

  return await populateCartService(cart);
};

export const editProductInCartService = async (id, prod, qty) => {
  let cart = await getCartService(id);

  let product = await getProductService(prod);

  let productoEnCarrito = cart.products.find(
    (product) => product.product._id.toString() === prod
  );

  if (qty === null) {
    qty = productoEnCarrito ? productoEnCarrito.quantity + 1 : 1;
  }

  if (productoEnCarrito) {
    if (product.stock >= qty) {
      product.stock -= qty;
      let prodIndex = cart.products.findIndex(
        (prod) => prod.product._id.toString() === prod
      );
      cart.products[prodIndex].quantity = qty;
    } else {
      throw new Error("No hay suficiente stock del producto");
    }
  } else {
    if (product.stock >= qty) {
      product.stock -= qty;
      cart.products.push({ product: prod, quantity: qty });
    } else {
      throw new Error("No hay suficiente stock del producto");
    }
  }

  if (product.stock <= 0) {
    product.status = false;
  }

  let cartEdited = await cartService.editCart(id, cart.products);
  if (!cartEdited) {
    throw new Error(`Error al editar el carrito con id ${id}`);
  }

  return {
    cartUpdated: await populateCartService(cartEdited),
    productVirtual: product,
  };
};

export const emptyCartService = async (id) => {
  cart = await cartService.editCart(id, []);

  if (!cart) {
    throw new Error(`No se encuentra el carrito con id ${id}`);
  }

  return await populateCartService(cart);
};

export const deleteProductInCartService = async (id, prod) => {
  let cart = await getCartService(id);

  let product = cart.products.find(
    (prodCarrito) => prodCarrito.product._id.toString() === prod
  );

  if (!product) {
    throw new Error(
      `No exite el producto con id ${prod} en el carrito de id ${id}`
    );
  }
  cart.products = cart.products.filter(
    (productToDelete) => productToDelete.product._id.toString() !== prod
  );

  let newCart = await cartService.editCart(id, cart.products);

  if (!newCart) {
    throw new Error(`No se pudo editar el carrito`);
  }

  return await populateCartService(newCart);
};

const populateCartService = async (cart) => {
  let cartsPopulate = await cartService.populateCart(cart);

  if (!cartsPopulate) {
    throw new Error("Error al popular el carrito");
  }

  return cartsPopulate;
};
