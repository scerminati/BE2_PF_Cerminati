import express from "express";

import {
  getAllCartsController,
  getCartController,
  getCartQTController,
  createCartController,
  editProductInCartController,
  emptyCartController,
  deleteProductInCartController,
} from "../controllers/carts.controllers.js";

import {
  isAuthenticated,
  isUserCart,
  isAdmin,
  navigate,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllCartsController);
router.get("/:cid", isAuthenticated, isUserCart, getCartController);
router.get("/:cid/QT", navigate, getCartQTController);

router.post("/", isAuthenticated, isAdmin, createCartController);

router.put(
  "/:cid/product/:pid",
  isAuthenticated,
  isUserCart,
  editProductInCartController
);

router.delete("/:cid", isAuthenticated, isUserCart, emptyCartController);
router.delete(
  "/:cid/product/:pid",
  isAuthenticated,
  isUserCart,
  deleteProductInCartController
);

export default router;
