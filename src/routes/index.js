import express from "express";
import authRoutes from "./auth.route.js";
import paymentRoutes from "./payment.route.js";
import transactionRoutes from "./transaction.route.js";
import { getSchools } from "../controllers/schools.contollers.js";
import isLoggedIn from "../middlewares/isLoggedin.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/payment", paymentRoutes);
router.use("/transactions", transactionRoutes);
router.get("/schools", isLoggedIn, getSchools);

export default router;
