import productsModel from "../models/products.model.js";

export default class Product {
  getAllProducts = async () => {
    try {
      return await productsModel.find({});
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getProduct = async (id) => {
    try {
      return await productsModel.findOne({ _id: id });
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
      return await productsModel.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteProduct = async (id) => {
    try {
      return await productsModel.findOneAndDelete({
        _id: id,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
