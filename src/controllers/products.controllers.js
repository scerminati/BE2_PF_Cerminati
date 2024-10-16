import Product from "../DAO/services/productsServices.js";

import { socketServer } from "../app.js";

const productService = new Product();

export const getAllProductsController = async (req, res) => {
  let limit = parseInt(req.query.limit);
  try {
    const products = await productService.getAllProducts();

    if (!products.length) {
      return res.status(404).json({ msg: "No hay productos para mostrar" });
    }

    const productosLimitados =
      !isNaN(limit) && limit > 0 ? products.slice(0, limit) : products;

    return res.status(200).json({
      msg:
        productosLimitados.length < products.length
          ? `Mostrando los primeros ${limit} productos`
          : "Mostrando todos los productos",
      productos: productosLimitados,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener los productos." });
  }
};

export const getProductController = async (req, res) => {
  const idProducto = req.params.pid;
  try {
    const productoEncontrado = await productService.getProduct(idProducto);

    if (productoEncontrado) {
      res.status(200).json({
        msg: `Mostrando el producto con id ${idProducto}`,
        productoEncontrado,
      });
    } else {
      res.status(404).json({ msg: "No se encuentra el producto con dicho id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener el producto." });
  }
};

///
export const createProductController = async (req, res) => {
  let { title, description, code, price, stock, category } = req.body;
  code = parseInt(code);
  price = parseFloat(price);
  stock = parseInt(stock);

  const thumbnail = req.file ? `../images/${req.file.originalname}` : "";

  if (
    (title !== undefined && typeof title !== "string") ||
    (description !== undefined && typeof description !== "string") ||
    (code !== undefined && (typeof code !== "number" || code < 1)) ||
    (price !== undefined && (typeof price !== "number" || price < 1)) ||
    (stock !== undefined && (typeof stock !== "number" || stock < 0)) ||
    (category !== undefined && typeof category !== "string")
  ) {
    return res.status(400).json({
      msg: "Falta algún campo obligatorio o alguno de los campos tiene el tipo de dato incorrecto.",
    });
  }

  let status = stock > 0;
  try {
    const newProduct = {
      id: await productService.nextId(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    };

    await productService.createProduct(newProduct);
    socketServer.emit("Product Update", newProduct);
    res.status(201).json({
      msg: `Producto agregado exitosamente con id ${newProduct.id}`,
      newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al guardar el producto." });
  }
};

///
export const editProductController = async (req, res) => {
  const idProducto = req.params.pid;
  const { title, description, code, price, stock, category } = req.body;

  const thumbnail = req.file ? `../images/${req.file.originalname}` : "";

  const updateData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(code && { code: parseInt(code) }),
    ...(price && { price: parseFloat(price) }),
    ...(stock !== undefined && { stock: parseInt(stock) }),
    status: stock > 0,
    ...(category && { category }),
    ...(thumbnail && { thumbnail }),
  };

  try {
    const updatedProduct = await productService.editProduct(
      idProducto,
      updateData
    );

    if (updatedProduct) {
      socketServer.emit("Product Update", updatedProduct);
      res.status(200).json({
        msg: `Producto modificado correctamente en el id ${idProducto}`,
        productoModificado: updatedProduct,
      });
    } else {
      res.status(404).json({ msg: "No se encuentra el producto con dicho id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al modificar el producto." });
  }
};

///
export const deleteProductController = async (req, res) => {
  const idProducto = req.params.pid;
  try {
    const deletedProduct = await productService.deleteProduct(idProducto);

    if (deletedProduct) {
      socketServer.emit("Product Deleted", deletedProduct);
      res.status(200).json({
        msg: `Se eliminó el producto con id ${idProducto}`,
        productoAEliminar: deletedProduct,
      });
    } else {
      res.status(404).json({ msg: "No se encuentra el producto con dicho id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el producto." });
  }
};
