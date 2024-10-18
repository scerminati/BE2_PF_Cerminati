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
  passportCall,
} from "../middleware/auth.js";

const router = express.Router();

router.post("/register", isNotAuthenticated, registerUserController);
router.get("/current", passportCall("jwt"), getLoggedUserController);

router.post("/login", isNotAuthenticated, loginUserController);
router.post("/logout", isAuthenticated, logoutUserController);

router.post(
  "/checkout",
  passportCall("jwt"),
  isUserCart,
  checkoutCartController
);

export default router;
