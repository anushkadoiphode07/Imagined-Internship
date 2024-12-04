import express from "express";
import { createProduct, getProducts, updateProduct, getTotalStockQuantity } from "../controllers/productController";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.get("/total-stock", getTotalStockQuantity);

export default router;