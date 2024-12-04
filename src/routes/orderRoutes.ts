import express from "express";
import { createOrder, getOrders, updateOrder, getOrdersLast7Days, getOrdersByUser } from "../controllers/orderController";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/:id", updateOrder); 
router.get("/last-7-days", getOrdersLast7Days);
router.get("/user/:userId", getOrdersByUser);

export default router;
