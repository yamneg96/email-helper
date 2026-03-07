import { Router } from "express";
import { getCurrentUser, login, logout } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getCurrentUser);

export default authRouter;
