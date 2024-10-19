import express from "express";

import {
  getLoggedUserController,
  registerUserController,
  loginUserController,
  logoutUserController,
  checkoutCartController,
} from "../controllers/sessions.controller.js";

import {
  isAuthenticated,
  isNotAuthenticated,
  isUserCart,
} from "../middleware/auth.js";

const router = express.Router();

router.post("/register", isNotAuthenticated, registerUserController);
router.get("/current", isAuthenticated, getLoggedUserController);

router.post("/login", isNotAuthenticated, loginUserController);
router.post("/logout", isAuthenticated, logoutUserController);

router.post("/checkout", isAuthenticated, isUserCart, checkoutCartController);

export default router;
