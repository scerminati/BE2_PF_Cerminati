import {
  checkoutService,
  getCurrentLoggedUserService,
  loginUserService,
  registerUserService,
} from "../services/users.services.js";

import { socketServer } from "../app.js";

import { generateToken } from "../utils/session/webTokenUtil.js";

export const getLoggedUserController = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).send({ msg: "Datos de sesión incompletos" });
  }

  try {
    const user = await getCurrentLoggedUserService(userId);

    res.send({
      user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Error al obtener los datos del usuario" });
  }
};

export const registerUserController = async (req, res) => {
  const { first_name, last_name, password, email, age } = req.body;

  if (!first_name || !last_name || !password || !email || !age) {
    return res.status(400).send({ msg: "Datos de registro incompletos" });
  }
  try {
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password,
    };

    let createdUser = await registerUserService(newUser);
    console.log(
      "Usuario creado exitosamente:",
      createdUser,
      `y nuevo carrito creado para el usuario con id ${newCart._id}`
    );
    socketServer.emit("UserChange", createdUser);

    res.cookie("jwt", generateToken(createdUser), {
      httpOnly: true,
      secure: false,
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Error al registrar al usuario" });
  }
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ msg: "Datos de sesión incompletos" });
  }

  try {
    const user = await loginUserService(email, password);

    // Si la validación es exitosa, genera el JWT y redirige
    res.cookie("jwt", generateToken(user), {
      httpOnly: true,
      secure: false,
    });

    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ msg: "Error en el servidor al iniciar sesión" });
  }
};

export const logoutUserController = async (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

export const checkoutCartController = async (req, res) => {
  const idUser = req.params.uid;
  if (!idUser || idUser.length !== 24) {
    return res.status(400).json({ msg: "ID usuario inválido." });
  }

  try {
    const user = await checkoutService(idUser);
  
    
    return res.status(200).send({ msg: "Compra realizada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error al completar la compra" });
  }
};
