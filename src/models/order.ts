import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  orderDate: { type: Date, default: Date.now },
  quantity: { type: Number, required: true },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);