import express from "express";

import {
  getLoggedUserController,
  registerUserController,
  loginUserController,
  logoutUserController,
  checkoutCartController,
} from "../controllers/sessions.controller.js";

import { passportCall } from "../utils/session/passportUtils.js";

const router = express.Router();

router.get("/current", passportCall("jwt"), getLoggedUserController);

router.post("/register", registerUserController);

router.post("/login", loginUserController);
router.post("/logout", logoutUserController);

router.post("/checkout", passportCall("jwt"), checkoutCartController);

export default router;
