import UsersRepository from "../DAO/repositories/usersRepository.js";
import { UsersDAO } from "../DAO/DAOFactory.js";

import UserDTO from "../DAO/DTO/user.DTO.js";
import {
  getCartService,
  editProductInCartService,
  createCartService,
} from "./carts.service.js";
import { editProductService } from "./products.services.js";
import { createTicketService } from "./tickets.services.js";

const userService = new UsersRepository(UsersDAO);

export const getAllUsersService = async (limit) => {
  let users = await userService.getAllUsers();

  if (!users) {
    throw new Error("No hay usuarios para mostrar");
  }

  if (!isNaN(limit) && limit > 0) {
    users = users.slice(0, limit);
  }

  return users.map((user) => new UserDTO(user));
};

export const getUserByEmailService = async (email) => {
  let user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error(`No se encuentra el usuario con email ${email}`);
  }

  return new UserDTO(user);
};

export const getUserByIdService = async (id) => {
  let user = await userService.getUserById(id);

  if (!user) {
    throw new Error(`No se encuentra el usuario con el id ${id}`);
  }

  return new UserDTO(user);
};

export const makeAdminService = async (id) => {
  let user = await getUserByIdService(id);

  user = await userService.roleChange(id, "admin");

  if (!user) {
    throw new Error(`Error al cambiar el rol del usuario`);
  }
  return new UserDTO(user);
};

export const makeUserService = async (id) => {
  let user = await getUserByIdService(id);

  user = await userService.roleChange(id, "user");

  if (!user) {
    throw new Error(`Error al cambiar el rol del usuario`);
  }
  return new UserDTO(user);
};

export const getCurrentLoggedUserService = async (id) => {
  let user = await userService.getLoggedUser(id);
  if (!user) {
    throw new Error(`No se encuentra el usuario con id ${id}`);
  }

  return new UserDTO(user);
};

export const registerUserService = async (data) => {
  let user = await getUserByEmailService(data.email);
  if (user) {
    throw new Error(`El correo electrónico ya está en uso.`);
  }

  let newUser = data;
  newUser.password = await userService.createHash(newUser.password);

  newUser.role = "user";

  let cart = await createCartService();
  newUser.cart = cart._id;

  let register = await userService.createUser(newUser);
  if (!register) {
    throw new Error(`No se pudo registrar el usuario`);
  }

  return new UserDTO(register);
};

export const loginUserService = async (email, password) => {
  let user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error(`Correo o constraseña incorrecta`);
  }
  let validation = await userService.validatePassword(user, password);
  if (!validation) {
    throw new Error(`Correo o constraseña incorrecta`);
  }

  return new UserDTO(user);
};

export const checkoutService = async (userId) => {
  let user = await getCurrentLoggedUserService(userId);
  let userCart = await getCartService(user.cart);

  if (!userCart || userCart.products.length === 0) {
    throw new Error(`No se puede realizar el checkout, carrito vacío`);
  }

  let futureCart = [];
  let currentPurchase = [];
  let newProductPurchase;

  for (const item of userCart.products) {
    const productId = item.product._id;
    const quantityRequested = item.quantity;

    const product = await getProductByIdService(productId);

    if (quantityRequested > product.stock) {
      futureCart.push(item);
    } else {
      const newStock = product.stock - quantityRequested;
      await editProductService(productId, { stock: newStock });
      newProductPurchase = {
        title: product.title,
        quantity: quantityRequested,
        price: product.price,
        totalProduct: product.price * quantityRequested,
      };
      currentPurchase.push(newProductPurchase);
    }
  }

  if (currentPurchase.length == 0) {
    throw new Error(
      `No se puede realizar la compra, los productos dentro del carrito no tienen stock.`
    );
  }
  const totalPrice = currentPurchase.reduce((total, item) => {
    return total + item.totalProduct;
  }, 0);
  let ticket = await createTicketService(userId, currentPurchase, totalPrice);

  ///MAILING

  let newCart = await createCartService();
  let newUserCart = await userService.updateUserCart(newCart._id);

  if (!newUserCart) {
    throw new Error(`Error al asignar el nuevo carrito al usuario.`);
  }

  if (futureCart.length > 0) {
    for (const item of futureCart) {
      const { product, quantity } = item;

      await editProductInCartService(user.cart, product._id, quantity);
    }
  }

  return "sucess";
};
