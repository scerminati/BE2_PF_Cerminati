//Autenticar el inicio de sesión mediante passport y redirecciones correspondientes

import passport from "passport";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: "Not Authenticated" });
    if (req.user.role !== role)
      return res.status(403).send({ error: "Not correct role, no permission" });
    next();
  };
};

export const isNotAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Si el usuario no está autenticado, permite el acceso a la ruta
      return next();
    }

    // Si el usuario ya está autenticado, redirige al perfil
    return res.redirect("/profile");
  })(req, res, next);
};

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Si el usuario no está autenticado, redirige al login
      return res.redirect("/login");
    }

    // Si el usuario está autenticado, continúa
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req, res, next) => {
  // Asegúrate de que el usuario esté autenticado
  if (!req.user) {
    return res.redirect("/login"); // Redirige al login si no está autenticado
  }
  // Verifica si el rol del usuario es admin
  if (req.user.role !== "admin") {
    return res.status(403).send({ error: "Access Denied" });
  }
  next();
};

// Middleware para verificar acceso al carrito del usuario
export const isUserCart = (req, res, next) => {
  const { cid } = req.params;
  if (!req.user) {
    return res.redirect("/login"); // Redirige al login si no está autenticado
  }
  if (req.user.cartId !== cid) {
    return res.status(403).send({ error: "Access Denied to this Cart" });
  }
  next();
};
