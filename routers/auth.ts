import express from "express";

import { createUser, login } from "../controllers/users";
import { vaidateSignin, vaidateSignup } from "../middlewares/validation";

const router = express.Router();

router.post("/signup", vaidateSignup, createUser);
router.post("/signin", vaidateSignin, login);

export default router;
