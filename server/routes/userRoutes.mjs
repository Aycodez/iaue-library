import { Router } from "express";

import { createUser, getAllUsers, loginUser } from "../controllers/auth.mjs";
const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.post("/auth", loginUser);

export default router;
