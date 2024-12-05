"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalStockQuantity = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const product_1 = require("../models/product");
const mongoose_1 = __importDefault(require("mongoose"));
// Create Product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = new product_1.Product(req.body);
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
});
exports.createProduct = createProduct;
// Get All Products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.Product.find();
        res.status(200).json(products);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
});
exports.getProducts = getProducts;
// Update Product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate product ID
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }
        // Update the product
        const updatedProduct = yield product_1.Product.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Apply validations
        });
        if (!updatedProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
});
exports.updateProduct = updateProduct;
// Get Total Stock quantity
const getTotalStockQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aggregate the total stock quantity from all products
        const totalStock = yield product_1.Product.aggregate([
            {
                $group: {
                    _id: null, // We don't need to group by any field
                    totalStock: { $sum: "$stockQuantity" }, // Sum up the stockQuantity field
                },
            },
        ]);
        if (!totalStock.length) {
            res.status(404).json({ message: "No products found" });
            return;
        }
        res.status(200).json({ totalStock: totalStock[0].totalStock });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
});
exports.getTotalStockQuantity = getTotalStockQuantity;
