import UsersRepository from "../DAO/repositories/usersRepository.js";
import { UsersDAO } from "../DAO/DAOFactory.js";

import { socketServer } from "../app.js";

const userService = new UsersRepository(UsersDAO);

export const getAllUsersController = async (req, res) => {
  let limit = parseInt(req.query.limit);

  try {
    let users = await userService.getAllUsers();

    if (!users.length) {
      return res.status(404).json({ msg: "No hay usuarios para mostrar" });
    }

    let usersLimitados =
      !isNaN(limit) && limit > 0 ? users.slice(0, limit) : users;

    return res.status(200).json({
      msg:
        usersLimitados.length < users.length
          ? `Mostrando los primeros ${limit} usuarios`
          : "Mostrando todos los usuarios",
      payload: usersLimitados,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener los carritos." });
  }
};

export const makeAdmin = async (req, res) => {
  const idUser = req.params.uid;

  try {
    const newAdmin = await userService.makeAdmin(idUser);

    if (newAdmin) {
      socketServer.emit("UserChange", newAdmin);
      res.status(201).json({
        msg: `El usuario ${newAdmin.email} es ahora administrado`,
        payload: newAdmin,
      });
    } else {
      res.status(404).json({ msg: "No se encuentra el usuario" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error cambiar de rol." });
  }
};
export const makeUser = async (req, res) => {
  const idUser = req.params.uid;

  try {
    const newUser = await userService.makeUser(idUser);

    if (newUser) {
      socketServer.emit("UserChange", newUser);
      res.status(201).json({
        msg: `El usuario ${newUser.email} es ahora usuario`,
        payload: newUser,
      });
    } else {
      res.status(404).json({ msg: "No se encuentra el usuario" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error cambiar de rol." });
  }
};
