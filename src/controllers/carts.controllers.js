import Cart from "../DAO/services/cartsServices.js";
import Product from "../DAO/services/productsServices.js";

import { socketServer } from "../app.js";

const cartService = new Cart();
const productService = new Product();

export const getAllCartsController = async (req, res) => {
  let limit = parseInt(req.query.limit);

  try {
    let carts = await cartService.getAllCarts();

    if (!carts.length) {
      return res.status(404).json({ msg: "No hay productos para mostrar" });
    }

    let cartsLimitados =
      !isNaN(limit) && limit > 0 ? carts.slice(0, limit) : carts;

    return res.status(200).json({
      msg:
        cartsLimitados.length < carts.length
          ? `Mostrando los primeros ${limit} carritos`
          : "Mostrando todos los carritos",
      payload: cartsLimitados,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener los carritos." });
  }
};

export const getCartController = async (req, res) => {
  const idCarrito = req.params.cid;
  try {
    let cart = await cartService.getCart(idCarrito);

    if (!cart) {
      return res
        .status(404)
        .json({ msg: "No se encuentra el carrito con dicho id" });
    }

    res.status(200).json({
      msg: `Mostrando carrito con id ${idCarrito}`,
      payload: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener el carrito." });
  }
};

export const getCartQTController = async (req, res) => {
  const idCarrito = req.params.cid;
  try {
    let QT = await cartService.getCartQT(idCarrito);

    if (QT === null) {
      return res
        .status(404)
        .json({ msg: "No se encuentra el carrito con dicho id" });
    }
    res.status(200).json({
      msg: `Mostrando cantidad de carrito ${idCarrito}`,
      payload: QT,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener el carrito." });
  }
};

////
export const createCartController = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json({
      msg: `Nuevo carrito creado exitosamente con el id ${newCart._id}`,
      payload: newCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear el carrito." });
  }
};

///
export const editProductInCartController = async (req, res) => {
  const idCarrito = req.params.cid;
  const idProducto = req.params.pid;
  let quantity = parseInt(req.body.quantity) || null;

  try {
    const cart = await cartService.getCart(idCarrito);
    if (!cart) {
      return res
        .status(404)
        .json({ msg: `El carrito con id ${idCarrito} no existe.` });
    }

    const productToAdd = await productService.getProduct(idProducto);
    if (!productToAdd) {
      return res
        .status(404)
        .json({ msg: `El producto con id ${idProducto} no existe.` });
    }

    let productoEnCarrito = cart.products.find(
      (product) =>
        product.product._id.toString() === productToAdd._id.toString()
    );

    if (quantity === null) {
      quantity = productoEnCarrito ? productoEnCarrito.quantity + 1 : 1;
    }

    console.log(quantity);
    if (productoEnCarrito) {
      if (productToAdd.stock + productoEnCarrito.quantity >= quantity) {
        productToAdd.stock =
          productoEnCarrito.quantity + productToAdd.stock - quantity;

        console.log("hola?");
      } else {
        return res
          .status(404)
          .json({ msg: "No hay suficiente stock de este producto." });
      }
    } else {
      if (productToAdd.stock >= quantity) {
        productToAdd.stock -= quantity;
      } else {
        return res
          .status(404)
          .json({ msg: "No hay suficiente stock de este producto." });
      }
    }

    let productAdded = await productService.editProduct(
      idProducto,
      productToAdd
    );
    socketServer.emit("Product Update", productAdded);
    console.log(cart);
    let cartUpdated = await cartService.editCart(
      idCarrito,
      idProducto,
      quantity
    );
    socketServer.emit("Cart Update", cartUpdated);

    res.status(202).json({
      msg: `El producto ${idProducto} ha sido agregado correctamente al carrito ${idCarrito}`,
      cartUpdated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al agregar el producto al carrito." });
  }
};

export const emptyCartController = async (req, res) => {
  const idCarrito = req.params.cid;
  try {
    let cartToEmpty = await cartService.emptyCart(idCarrito);

    if (!cartToEmpty) {
      res.status(404).json({ msg: "No se encuentra el carrito con dicho id" });
    }

    console.log(cartToEmpty, "Antes de reajuste de stock");
    // Reajustar el stock de los productos en el carrito
    for (const item of cartToEmpty.products) {
      let idProd = item.product._id;
      let productoEnCarrito = await productService.getProduct(idProd);
      if (productoEnCarrito) {
        productoEnCarrito.stock += item.quantity;
        productoEnCarrito = await productService.editProduct(
          idProd,
          productoEnCarrito
        );
        socketServer.emit("Product Update", productoEnCarrito);
        console.log(productoEnCarrito, "nuevo stock");
      }
    }

    const emptyCart = await cartService.getCart(idCarrito);
    socketServer.emit("Cart Update", emptyCart);

    res.status(200).json({
      msg: `Eliminados todos los productos del carrito con id ${idCarrito}`,
      emptyCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al borrar productos del carrito." });
  }
};

export const deleteProductInCartController = async (req, res) => {
  const idCarrito = req.params.cid;
  const idProduct = req.params.pid;

  try {
    let cartToModify = await cartService.delete1Cart(idCarrito, idProduct);
    if (!cartToModify) {
      res.status(404).json({ msg: "No se encuentra el carrito con dicho id" });
    } else if (cartToModify === 1) {
      res
        .status(404)
        .json({ msg: "No se encuentra el producto dentro del carrito" });
    }

    // Encontrar el producto a eliminar en el carrito
    let productoEnCarrito = cartToModify.products.find(
      (product) => product.product._id.toString() === idProduct
    );

    // Actualizar el stock del producto
    let producto = await productService.getProduct(idProduct);
    producto.stock += productoEnCarrito.quantity;

    productService.editProduct(idProduct, producto);
    socketServer.emit("Product Update", producto);

    let cartMofidied = await cartService.getCart(idCarrito);

    socketServer.emit("Cart Update", cartMofidied);

    res.status(200).json({
      msg: `Producto con id ${idProduct} eliminado del carrito con id ${idCarrito}`,
      cartMofidied,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar el producto del carrito." });
  }
};
