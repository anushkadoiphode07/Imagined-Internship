import { Request, Response } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
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

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("user product");
    res.json(orders);
  } catch (error) {
    if (error instanceof Error) {
        res.status(400).json({ error: error.message });
    } else {
        res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid order ID" });
        return;
      }
  
      // Perform the update
      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
  
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