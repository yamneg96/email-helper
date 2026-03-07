import { Router } from "express";
import { updateProfile, updateSettings } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.use(protect);
userRouter.put("/profile", updateProfile);
userRouter.put("/settings", updateSettings);

export default userRouter;
