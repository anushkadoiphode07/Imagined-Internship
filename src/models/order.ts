import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Index for faster querying by user
orderSchema.index({ user: 1 });
// Index for filtering by products
orderSchema.index({ "products.product": 1 });
// Index for querying by createdAt (e.g., recent orders)
orderSchema.index({ orderDate: -1 });

export const Order = mongoose.model("Order", orderSchema);