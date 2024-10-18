import express from "express";

import { getAllUsersController } from "../controllers/users.controllers.js";

import { isAuthenticated, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsersController);

export default router;
