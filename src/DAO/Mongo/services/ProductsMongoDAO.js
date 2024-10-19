import productsModel from "../models/products.model.js";

export default class ProductsMongoDAO {
  find = async () => {
    try {
      return await productsModel.find({}).sort({ id: 1 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  findById = async (id) => {
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

  create = async (product) => {
    if (product.stock > 0) {
      product.status = true;
    } else {
      product.status = false;
    }
    product.id = this.nextId;
    try {
      return await productsModel.create(product);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  edit = async (id, updateData) => {
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

  deleteP = async (id) => {
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

  paginate = async (filter, values) => {
    try {
      let products;

      products = await productsModel.paginate(filter, values);

      return products ? products : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  categories = async () => {
    try {
      const categories = await productsModel.distinct("category");
      return categories ? categories : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
