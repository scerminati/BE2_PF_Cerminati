import {
  getAllProductsService,
  getProductService,
  createProductService,
  editProductService,
  deleteProductService,
} from "../services/products.services.js";

import { socketServer } from "../app.js";

export const getAllProductsController = async (req, res) => {
  let limit = parseInt(req.query.limit);
  try {
    const products = await getAllProductsService(limit);

    return res.status(200).json({
      msg:
        products.length < limit
          ? `Mostrando los primeros ${limit} productos`
          : "Mostrando todos los productos",
      payload: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los productos." });
  }
};

export const getProductController = async (req, res) => {
  const idProducto = req.params.pid;

  if (!idProducto || idProducto.length !== 24) {
    return res.status(400).json({ msg: "ID de producto inválido." });
  }

  try {
    const productoEncontrado = await getProductService(idProducto);

    return res.status(200).json({
      msg: `Mostrando el producto con id ${idProducto}`,
      payload: productoEncontrado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el producto." });
  }
};

///
export const createProductController = async (req, res) => {
  let { title, description, code, price, stock, category } = req.body;

  // Validaciones para asegurar que los campos obligatorios no estén vacíos o incorrectos
  if (!title || typeof title !== "string") {
    return res.status(400).json({
      msg: "El título es obligatorio y debe ser una cadena de texto.",
    });
  }

  if (!description || typeof description !== "string") {
    return res.status(400).json({
      msg: "La descripción es obligatoria y debe ser una cadena de texto.",
    });
  }

  if (!code || isNaN(code) || parseInt(code) <= 0) {
    return res
      .status(400)
      .json({ msg: "El código es obligatorio y debe ser un número positivo." });
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    return res
      .status(400)
      .json({ msg: "El precio es obligatorio y debe ser un número positivo." });
  }

  if (stock === undefined || isNaN(stock) || parseInt(stock) < 0) {
    return res.status(400).json({
      msg: "El stock es obligatorio y debe ser un número igual o mayor a 0.",
    });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({
      msg: "La categoría es obligatoria y debe ser una cadena de texto.",
    });
  }

  // Procesar la imagen si se ha subido
  const thumbnail = req.file ? `../images/${req.file.originalname}` : "";

  try {
    let newProduct = {
      title,
      description,
      code: parseInt(code),
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      thumbnail,
    };

    newProduct = await createProductService(newProduct);

    socketServer.emit("Product Update", newProduct);
    res.status(201).json({
      msg: `Producto agregado exitosamente con id ${newProduct._id}`,
      payload: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al guardar el producto." });
  }
};

///
export const editProductController = async (req, res) => {
  const idProducto = req.params.pid;

  if (!idProducto || idProducto.length !== 24) {
    return res.status(400).json({ msg: "ID de producto inválido." });
  }

  const { title, description, code, price, stock, category } = req.body;

  const thumbnail = req.file ? `../images/${req.file.originalname}` : "";

  const updateData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(code && { code: parseInt(code) }),
    ...(price && { price: parseFloat(price) }),
    ...(stock !== undefined && { stock: parseInt(stock) }),
    ...(category && { category }),
    ...(thumbnail && { thumbnail }),
  };

  try {
    const updatedProduct = await editProductService(idProducto, updateData);

    socketServer.emit("Product Update", updatedProduct);
    return res.status(200).json({
      msg: `Producto modificado correctamente en el id ${idProducto}`,
      payload: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al modificar el producto." });
  }
};

///
export const deleteProductController = async (req, res) => {
  const idProducto = req.params.pid;

  if (!idProducto || idProducto.length !== 24) {
    return res.status(400).json({ msg: "ID de producto inválido." });
  }
  try {
    const deletedProduct = await deleteProductService(idProducto);

    socketServer.emit("Product Deleted", deletedProduct);
    return res.status(200).json({
      msg: `Se eliminó el producto con id ${idProducto}`,
      payload: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al eliminar el producto." });
  }
};
