import express from "express";

import { getAllUsersController } from "../controllers/users.controllers.js";

const router = express.Router();

router.get("/", getAllUsersController);

export default router;