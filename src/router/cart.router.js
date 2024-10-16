import express from "express";

const router = express.Router();

router.get("/",getAllCartsController)
router.get("/:cid",getCartController)
router.get("/:cid/QT",getCartQTController)

router.post("/",createCartController)

router.put("/:cid/product/:pid",editProductInCartController)

router.delete("/:cid",deleteCartController)
router.delete("/:cid/product/:pid",deleteProductInCartController)


export default router;
