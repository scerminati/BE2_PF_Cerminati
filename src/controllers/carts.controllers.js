import {
  getAllCartsService,
  getCartService,
  getCartQTService,
  createCartService,
  emptyCartService,
  deleteProductInCartService,
  editProductInCartService,
} from "../services/carts.Services.js";

import { socketServer } from "../app.js";

export const getAllCartsController = async (req, res) => {
  let limit = parseInt(req.query.limit);

  try {
    const carts = await getAllCartsService(limit);

    return res.status(200).json({
      msg:
        carts.length < limit
          ? `Mostrando los primeros ${carts.length} carritos`
          : "Mostrando todos los carritos",
      payload: carts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los carritos." });
  }
};

export const getCartController = async (req, res) => {
  const idCarrito = req.params.cid;

  if (!idCarrito || idCarrito.length !== 24) {
    return res.status(400).json({ msg: "ID de carrito inválido." });
  }
  try {
    let cart = await getCartService(idCarrito);

    return res.status(200).json({
      msg: `Mostrando carrito con id ${idCarrito}`,
      payload: cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el carrito." });
  }
};

export const getCartQTController = async (req, res) => {
  const idCarrito = req.params.cid;

  if (!idCarrito || idCarrito.length !== 24) {
    return res.status(400).json({ msg: "ID de carrito inválido." });
  }
  try {
    let QT = await getCartQTService(idCarrito);

    if (QT === null) {
      return res
        .status(404)
        .json({ msg: "No se encuentra el carrito con dicho id" });
    }
    return res.status(200).json({
      msg: `Mostrando cantidad de carrito ${idCarrito}`,
      payload: QT,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el carrito." });
  }
};

export const createCartController = async (req, res) => {
  try {
    const newCart = await createCartService();
    return res.status(201).json({
      msg: `Nuevo carrito creado exitosamente con el id ${newCart._id}`,
      payload: newCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el carrito." });
  }
};

export const editProductInCartController = async (req, res) => {
  const idCarrito = req.params.cid;
  if (!idCarrito || idCarrito.length !== 24) {
    return res.status(400).json({ msg: "ID de carrito inválido." });
  }
  const idProducto = req.params.pid;
  if (!idProducto || idProducto.length !== 24) {
    return res.status(400).json({ msg: "ID de producto inválido." });
  }
  let quantity = parseInt(req.body.quantity) || null;

  try {
    const { cartUpdated, productVirtual } = await editProductInCartService(
      idCarrito,
      idProducto,
      quantity
    );

    socketServer.emit("Product Update", productVirtual);

    socketServer.emit("Cart Update", cartUpdated);

    return res.status(200).json({
      msg: `El producto ${idProducto} ha sido agregado correctamente al carrito ${idCarrito}`,
      payload: cartUpdated,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Error al agregar el producto al carrito." });
  }
};

//ver producto virtual
export const emptyCartController = async (req, res) => {
  const idCarrito = req.params.cid;
  if (!idCarrito || idCarrito.length !== 24) {
    return res.status(400).json({ msg: "ID de carrito inválido." });
  }
  try {
    const emptyCart = await emptyCartService(idCarrito);
    socketServer.emit("Cart Update", emptyCart);

    return res.status(200).json({
      msg: `Eliminados todos los productos del carrito con id ${idCarrito}`,
      payload: emptyCart,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Error al borrar productos del carrito." });
  }
};

///ver producto virtual
export const deleteProductInCartController = async (req, res) => {
  const idCarrito = req.params.cid;
  if (!idCarrito || idCarrito.length !== 24) {
    return res.status(400).json({ msg: "ID de carrito inválido." });
  }
  const idProducto = req.params.pid;
  if (!idProducto || idProducto.length !== 24) {
    return res.status(400).json({ msg: "ID de producto inválido." });
  }

  try {
    let cartModified = await deleteProductInCartService(idCarrito);

    socketServer.emit("Cart Update", cartModified);

    return res.status(200).json({
      msg: `Producto con id ${idProducto} eliminado del carrito con id ${idCarrito}`,
      payload: cartModified,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Error al eliminar el producto del carrito." });
  }
};
