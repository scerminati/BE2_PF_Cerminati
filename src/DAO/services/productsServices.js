import productsModel from "../models/products.model.js";

export default class Product {
  getAllProducts = async () => {
    try {
      return await productsModel.find({}).sort({ id: 1 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getProduct = async (id) => {
    try {
      const product = await productsModel.findOne({ _id: id });
      return product ? product : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  nextId = async () => {
    try {
      const lastProduct = await productsModel.findOne(
        {},
        {},
        { sort: { id: -1 } }
      );
      return lastProduct ? lastProduct.id + 1 : 1;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createProduct = async (product) => {
    if (product.stock > 0) {
      product.status = true;
    } else {
      product.status = false;
    }
    try {
      return await productsModel.create(product);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  editProduct = async (id, updateData) => {
    if (updateData.stock > 0) {
      updateData.status = true;
    } else {
      updateData.status = false;
    }
    try {
      const product = await productsModel.findOneAndUpdate(
        { _id: id },
        updateData,
        {
          new: true,
        }
      );
      return product ? product : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  editStock = async (id, stock) => {
    let status;
    if (stock > 0) {
      status = true;
    } else {
      status = false;
    }
    try {
      const product = await productsModel.findOneAndUpdate(
        { _id: id },
        { stock, status },
        {
          new: true,
        }
      );
      return product ? product : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteProduct = async (id) => {
    try {
      const product = await productsModel.findOneAndDelete({
        _id: id,
      });
      return product ? product : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  paginateProducts = async (filter, values) => {
    try {
      let products;

      products = await productsModel.paginate(filter, values);

      return products ? products : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  categoryProducts = async () => {
    try {
      const categories = await productsModel.distinct("category");
      return categories ? categories : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
