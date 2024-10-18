import Session from "../DAO/services/sessionsServices.js";
import User from "../DAO/services/usersServices.js";
import Cart from "../DAO/services/cartsServices.js";

import { socketServer } from "../app.js";

import { generateToken } from "../utils/session/webTokenUtil.js";

const sessionService = new Session();
const userService = new User();
const cartService = new Cart();

export const getLoggedUserController = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).send({ msg: "Datos de sesión incompletos" });
  }

  try {
    const user = await sessionService.getLoggedUser(userId);

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    // Envía la información del usuario como respuesta
    res.send({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error al obtener los datos del usuario logueado:", error);
    res.status(500).send({ error: "Error al obtener los datos del usuario" });
  }
};

export const registerUserController = async (req, res) => {
  const { first_name, last_name, password, email, age } = req.body;

  if (!first_name || !last_name || !password || !email || !age) {
    return res.status(400).send({ msg: "Datos de registro incompletos" });
  }
  try {
    let user = await userService.getUser(email);
    if (user) {
      console.log("El usuario ya existe");
      return res
        .status(400)
        .send({ msg: "El correo electrónico ya está en uso" });
    }

    let newCart = await cartService.createCart();
    console.log(newCart);

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password,
      role: "user",
      cart: newCart._id,
    };

    let createdUser = await userService.createUser(newUser);
    console.log(
      "Usuario creado exitosamente:",
      createdUser,
      `y nuevo carrito creado para el usuario con id ${newCart._id}`
    );
    socketServer.emit("UserChange", createdUser);
    // Set a JWT cookie
    res.cookie("jwt", generateToken(createdUser), {
      httpOnly: true,
      secure: false,
    });

    res.redirect("/login");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ msg: "Datos de sesión incompletos" });
  }

  try {
    const user = await userService.loginUser(email, password);

    // Verificar si el usuario existe
    if (!user) {
      console.log("Usuario o contraseña erróneos");
      return res.status(404).send({ msg: "Usuario o contraseña erróneos" });
    }

    // Si la validación es exitosa, genera el JWT y redirige
    res.cookie("jwt", generateToken(user), {
      httpOnly: true,
      secure: false,
    });

    return res.redirect("/profile");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
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
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).send({ msg: "Datos de sesión incompletos" });
  }

  try {
    const user = await sessionService.getLoggedUser(userId);
    if (!user.cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    // Crea un nuevo carrito
    let newCart = await cartService.createCart();
    await userService.updateUserCart(userId, newCart._id);

    // Responder al cliente con un mensaje de éxito
    res.status(200).send({ msg: "Compra realizada exitosamente" });
  } catch (error) {
    console.error("Error al completar la compra:", error);
    res.status(500).send({ error: "Error al completar la compra" });
  }
};
