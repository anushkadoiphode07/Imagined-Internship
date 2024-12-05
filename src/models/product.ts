import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
  },
  { timestamps: true }
);

// Index for faster product search
productSchema.index({ name: 1 });
// Index for querying by category
productSchema.index({ category: 1 });

export const Product = mongoose.model("Product", productSchema);