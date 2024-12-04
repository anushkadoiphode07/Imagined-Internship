import { Request, Response } from "express";
import { Order } from "../models/order";
import { Product } from "../models/product";
import mongoose from "mongoose";

// Reusable population options
const populateOptions = [
  { path: "user", select: "name email" },
  { path: "products.product", select: "name category price" },
];

// Create Order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, products } = req.body;

    // Validate MongoDB ObjectId for user
    if (!mongoose.Types.ObjectId.isValid(user)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    // Validate MongoDB ObjectId for each product and its quantity
    if (
      !Array.isArray(products) ||
      products.some(
        (item) =>
          !mongoose.Types.ObjectId.isValid(item.product) || typeof item.quantity !== "number"
      )
    ) {
      res.status(400).json({ error: "Invalid product details" });
      return;
    }

    // Decrease the product quantity in stock for each ordered product
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        res.status(404).json({ error: `Product with ID ${item.product} not found` });
        return;
      }

      // Check if the product has enough stock
      if (product.stockQuantity < item.quantity) {
        res.status(400).json({ error: `Not enough stock for product: ${product.name}` });
        return;
      }

      // Reduce the stock quantity
      product.stockQuantity -= item.quantity;

      // Save the updated product stock quantity
      await product.save();
    }

    // Create and save the order
    const order = new Order({ user, products });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

// Get All Orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate(populateOptions);
    res.status(200).json(orders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

// Update Order
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { products, user, ...otherFields } = req.body;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    // Validate products if present
    if (products) {
      if (!Array.isArray(products)) {
        res.status(400).json({ error: "Products must be an array" });
        return;
      }
      for (const item of products) {
        if (!item.product || !mongoose.Types.ObjectId.isValid(item.product) || typeof item.quantity !== "number") {
          res.status(400).json({ error: "Invalid product details in update" });
          return;
        }
      }
    }

    // Perform update
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { ...otherFields, ...(products && { products }), ...(user && { user }) },
      {
        new: true,
        runValidators: true,
      }
    ).populate(populateOptions);

    if (!updatedOrder) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};