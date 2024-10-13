import express from "express";

const router = express.Router();

router.get("/",getAllCarts)
router.get("/:cid",getCart)
router.get("/:cid/QT",getCartQT)

router.post("/",createCart)

router.put("/:cid/product/:pid",editProductInCart)

router.delete("/:cid",deleteCart)
router.delete("/:cid/product/:pid",deleteProductInCart)


export default router;
