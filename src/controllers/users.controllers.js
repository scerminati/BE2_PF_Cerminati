import {
  getAllUsersService,
  makeAdminService,
  makeUserService,
} from "../services/users.services.js";

import { socketServer } from "../app.js";

export const getAllUsersController = async (req, res) => {
  let limit = parseInt(req.query.limit);

  try {
    let users = await getAllUsersService();

    return res.status(200).json({
      msg:
        users < limit
          ? `Mostrando los primeros ${limit} usuarios`
          : "Mostrando todos los usuarios",
      payload: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los carritos." });
  }
};

export const makeAdmin = async (req, res) => {
  const idUser = req.params.uid;

  if (!idUser || idUser.length !== 24) {
    return res.status(400).json({ msg: "ID usuario inválido." });
  }
  try {
    const newAdmin = await makeAdminService(idUser);

    socketServer.emit("UserChange", newAdmin);
    return res.status(200).json({
      msg: `El usuario ${newAdmin.email} es ahora administrado`,
      payload: newAdmin,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error cambiar de rol." });
  }
};

export const makeUser = async (req, res) => {
  const idUser = req.params.uid;
  if (!idUser || idUser.length !== 24) {
    return res.status(400).json({ msg: "ID usuario inválido." });
  }
  try {
    const newUser = await makeUserService(idUser);

    socketServer.emit("UserChange", newUser);
    return res.status(201).json({
      msg: `El usuario ${newUser.email} es ahora usuario`,
      payload: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error cambiar de rol." });
  }
};
