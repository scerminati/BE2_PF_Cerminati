import express from "express";

const router = express.Router();

router.get("/current",getLoggedUser)

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser)
router.post("/checkout",checkoutCart)


export default router;