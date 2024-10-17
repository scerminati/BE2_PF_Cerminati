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

import { isAuthenticated, isUserCart } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllCartsController);
router.get("/:cid", getCartController);
router.get("/:cid/QT", getCartQTController);

router.post("/", createCartController);

router.put("/:cid/product/:pid", editProductInCartController);

router.delete("/:cid", emptyCartController);
router.delete("/:cid/product/:pid", deleteProductInCartController);

export default router;
