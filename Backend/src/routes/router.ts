import { Router } from "express";
import adminRouter from "./admin.route";
import userRouter from "./user.route";

const router = Router();

router.use("/admin", adminRouter);
router.use("/user", userRouter);

export default router;
