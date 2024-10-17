import express from "express";

import {
  viewsPaginateController,
  viewsProductController,
  viewsCartController,
  viewsRTPController,
  viewsRTCController,
  viewsRTUController,
  viewsRTTController,
  viewsLoginController,
  viewsRegisterController,
  viewsProfileController,
} from "../controllers/views.controllers.js";

import {
  isAdmin,
  isAuthenticated,
  isNotAuthenticated,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", viewsPaginateController);
router.get("/products/:pid", viewsProductController);
router.get("/carts/:cid", isAuthenticated, viewsCartController);

router.get("/realtimeproducts", isAuthenticated, isAdmin, viewsRTPController);
router.get("/realtimecarts", isAuthenticated, isAdmin, viewsRTCController);
router.get("/realtimeusers", isAuthenticated, isAdmin, viewsRTUController);
router.get("/realtimeticket", isAuthenticated, isAdmin, viewsRTTController);

router.get("/login", isNotAuthenticated, viewsLoginController);
router.get("/register", isNotAuthenticated, viewsRegisterController);
router.get("/profile", isAuthenticated, viewsProfileController);

export default router;
