import express from "express";

import {
  getLoggedUserController,
  registerUserController,
  loginUserController,
  logoutUserController,
  checkoutCartController,
  cartLinkUpdateController,
} from "../controllers/sessions.controller.js";

import {
  isAuthenticated,
  isNotAuthenticated,
  isUserCart,
  navigate,
} from "../middleware/auth.js";

const router = express.Router();

router.post("/register", isNotAuthenticated, registerUserController);
router.get("/current", isAuthenticated, getLoggedUserController);

router.post("/login", isNotAuthenticated, loginUserController);
router.post("/logout", isAuthenticated, logoutUserController);

router.post("/checkout", isAuthenticated, checkoutCartController);

router.get("/cartLink", navigate, cartLinkUpdateController);

export default router;
