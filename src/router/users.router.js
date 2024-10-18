import express from "express";

import {
  getAllUsersController,
  makeAdmin,
  makeUser,
} from "../controllers/users.controllers.js";

import { isAuthenticated, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsersController);

router.put("/:uid/makeAdmin", isAuthenticated, isAdmin, makeAdmin);
router.put("/:uid/makeUser", isAuthenticated, isAdmin, makeUser);

export default router;
