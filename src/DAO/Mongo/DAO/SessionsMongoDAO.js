import userModel from "../models/user.model.js";

import UserDTO from "../../DTO/user.DTO.js";

export default class SessionsMongoDAO {
  current = async (id) => {
    try {
      let user = await userModel.findById({ _id: id }).populate("cart");
      return user ? new UserDTO(user) : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
