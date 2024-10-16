import express from "express";

import { uploader } from "../utils/database/multerUtils.js";

import {
  getAllProductsController,
  getProductController,
  createProductController,
  editProductController,
  deleteProductController,
} from "../controllers/products.controllers.js";

const router = express.Router();

router.get("/", getAllProductsController);
router.get("/:pid", getProductController);

router.post("/", uploader.single("thumbnail"), createProductController);

router.put("/:pid", uploader.single("thumbnail"), editProductController);

router.delete("/:pid", deleteProductController);

export default router;
