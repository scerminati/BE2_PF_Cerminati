import express from "express";

const router = express.Router();

router.get("/current",getLoggedUserController)

router.post("/register",registerUserController)
router.post("/login",loginUserController)
router.post("/logout",logoutUserController)
router.post("/checkout",checkoutCartController)


export default router;