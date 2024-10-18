import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

import UserDTO from "../DTO/user.DTO.js";

export default class User {
  getAllUsers = async () => {
    try {
      let user = await userModel.find({});
      return user ? user.map((user) => new UserDTO(user)) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getUser = async (email) => {
    try {
      let user = await userModel.findOne({ email });
      return user ? new UserDTO(user) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createUser = async (info) => {
    try {
      info.password = await this.createHash(info.password);
      let user = await userModel.create(info);
      return new UserDTO(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateUserCart = async (userId, newCartId) => {
    try {
      let user = await userModel.findByIdAndUpdate(
        userId,
        { cart: newCartId },
        { new: true } // devuelve el documento actualizado
      );
      return user ? new UserDTO(user) : null;
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

  makeAdmin = async (userId) => {
    try {
      let user = await userModel.findOneAndUpdate(
        { _id: userId },
        { role: "admin" },
        {
          new: true,
        }
      );
      return user ? new UserDTO(user) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  makeUser = async (userId) => {
    try {
      let user = await userModel.findOneAndUpdate(
        { _id: userId },
        { role: "user" },
        {
          new: true,
        }
      );
      return user ? new UserDTO(user) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
