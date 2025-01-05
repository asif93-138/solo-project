import { Router } from "express";
import { signUpWithLogin, login } from "../controllers/userController";

const router = Router();

router.post("/signup", signUpWithLogin);
router.post("/", login);
//router.get("/", getAllUsers);

export default router;
