import userModel from "../models/user.model.js";

export default class Session {
  getLoggedUser = async (id) => {
    try {
      let user = await userModel.findById({ _id: id }).populate("cart");
      return user ? user : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

