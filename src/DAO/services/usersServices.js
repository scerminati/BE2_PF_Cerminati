import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

export default class User {
  getAllUsers = async () => {
    try {
      let user = await userModel.find({});
      return user ? user : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getUser = async (email) => {
    try {
      let user = await userModel.findOne({ email });
      return user ? user : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createUser = async (info) => {
    try {
      info.password = await this.createHash(info.password);
      return await userModel.create(info);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateUserCart = async (userId, newCartId) => {
    try {
      return await userModel.findByIdAndUpdate(
        userId,
        { cart: newCartId },
        { new: true } // devuelve el documento actualizado
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  validatePassword = async (user, password) => {
    return bcrypt.compareSync(password, user.password);
  };
}
