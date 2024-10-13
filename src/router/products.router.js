import express from "express";

const router = express.Router();

router.get("/",getAllProducts)
router.get("/:pid",getProduct)

router.post("/",createProduct)

router.put("/:pid",editProduct)

router.delete("/:pid",deleteProduct)

export default router;