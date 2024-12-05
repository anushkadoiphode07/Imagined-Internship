"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
        },
    ],
    orderDate: { type: Date, default: Date.now },
}, { timestamps: true } // Automatically add createdAt and updatedAt fields
);
// Index for faster querying by user
orderSchema.index({ user: 1 });
// Index for filtering by products
orderSchema.index({ "products.product": 1 });
// Index for querying by createdAt (e.g., recent orders)
orderSchema.index({ orderDate: -1 });
exports.Order = mongoose_1.default.model("Order", orderSchema);
