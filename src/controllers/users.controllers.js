/*Todo los req y los res van acá, y llamo a servicios que manejan todo mi mongoose poronga, 
1. obtener todos los usuarios
2. quiero edición de permisos
3. borrar usuarios -> limpiar carritos


*/

import User from "../DAO/services/usersServices.js";

const userService = new User();

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
