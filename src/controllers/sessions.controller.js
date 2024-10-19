import {
  checkoutService,
  getCurrentLoggedUserService,
  loginUserService,
  registerUserService,
} from "../services/users.services.js";

import { generateToken } from "../utils/session/webTokenUtil.js";

import { emitUserChange } from "../utils/main/socketUtils.js";
import {
  BadRequestError,
  ValidationError,
} from "../utils/main/errorUtils.js";

export const getLoggedUserController = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return next(new ValidationError("ID usuario inválido."));
  }

  try {
    const user = await getCurrentLoggedUserService(userId);

    res.status(200).send({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const registerUserController = async (req, res, next) => {
  const { first_name, last_name, password, email, age } = req.body;

  if (!first_name || !last_name || !password || !email || !age) {
    return next(new BadRequestError("Datos de registro incompletos"));
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

    emitUserChange(createdUser);

    res.cookie("jwt", generateToken(createdUser), {
      httpOnly: true,
      secure: false,
    });

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Datos de sesión incompletos"));
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
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

export const checkoutCartController = async (req, res, next) => {
  const idUser = req.params.uid;
  if (!idUser || idUser.length !== 24) {
    return next(new ValidationError("ID usuario inválido."));
  }

  try {
    const user = await checkoutService(idUser);

    return res.status(200).send({ msg: "Compra realizada exitosamente" });
  } catch (error) {
    next(error);
  }
};
