import { Request, Response } from "express";
import { Product } from "../models/product";
import mongoose from "mongoose";
import { Order } from '../models/order';

// Create Product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

// Get All Products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Apply validations
    });

    if (!updatedProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

// Get total stock quantity

export const getTotalStockQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    // Aggregate the total stock quantity from all products
    const totalStock = await Product.aggregate([
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
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};