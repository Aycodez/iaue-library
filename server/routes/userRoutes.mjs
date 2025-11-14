import { Router } from "express";

import { createUser, loginUser } from "../controllers/auth.mjs";
const router = Router();

router.post("/", createUser);

router.post("/auth", loginUser);

export default router;
