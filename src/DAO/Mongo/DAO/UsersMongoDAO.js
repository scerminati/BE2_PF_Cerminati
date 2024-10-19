import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

import UserDTO from "../../DTO/user.DTO.js";

export default class UsersMongoDAO {
  find = async () => {
    try {
      let user = await userModel.find({});
      return user ? user.map((user) => new UserDTO(user)) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  findById = async (email) => {
    try {
      let user = await userModel.findOne({ email });
      return user ? new UserDTO(user) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  login = async (email, pass) => {
    try {
      let user = await this.findById(email);

      return this.validatePassword(user, pass) ? new UserDTO(user) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  create = async (info) => {
    try {
      info.password = await this.createHash(info.password);
      let user = await userModel.create(info);
      return new UserDTO(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  edit = async (userId, newCartId) => {
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

  admin = async (userId) => {
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

  user = async (userId) => {
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

  hash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  validate = async (user, password) => {
    return bcrypt.compareSync(password, user.password);
  };
}
