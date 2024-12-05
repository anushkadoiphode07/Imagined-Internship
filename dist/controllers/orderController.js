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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByProduct = exports.getOrdersByUser = exports.getOrdersLast7Days = exports.updateOrder = exports.getOrders = exports.createOrder = void 0;
const order_1 = require("../models/order");
const product_1 = require("../models/product");
const mongoose_1 = __importDefault(require("mongoose"));
// Reusable population options
const populateOptions = [
    { path: "user", select: "name email" },
    { path: "products.product", select: "name category price" },
];
// Create Order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, products } = req.body;
        // Validate MongoDB ObjectId for user
        if (!mongoose_1.default.Types.ObjectId.isValid(user)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }
        // Validate MongoDB ObjectId for each product and its quantity
        if (!Array.isArray(products) ||
            products.some((item) => !mongoose_1.default.Types.ObjectId.isValid(item.product) || typeof item.quantity !== "number")) {
            res.status(400).json({ error: "Invalid product details" });
            return;
        }
        // Decrease the product quantity in stock for each ordered product
        for (const item of products) {
            const product = yield product_1.Product.findById(item.product);
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
            yield product.save();
        }
        // Create and save the order
        const order = new order_1.Order({ user, products });
        yield order.save();
        res.status(201).json(order);
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
exports.createOrder = createOrder;
// Get All Orders
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.Order.find().populate(populateOptions);
        res.status(200).json(orders);
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
exports.getOrders = getOrders;
// Update Order
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const _a = req.body, { products, user } = _a, otherFields = __rest(_a, ["products", "user"]);
        // Validate order ID
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
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
                if (!item.product || !mongoose_1.default.Types.ObjectId.isValid(item.product) || typeof item.quantity !== "number") {
                    res.status(400).json({ error: "Invalid product details in update" });
                    return;
                }
            }
        }
        // Perform update
        const updatedOrder = yield order_1.Order.findByIdAndUpdate(id, Object.assign(Object.assign(Object.assign({}, otherFields), (products && { products })), (user && { user })), {
            new: true,
            runValidators: true,
        }).populate(populateOptions);
        if (!updatedOrder) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.status(200).json(updatedOrder);
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
exports.updateOrder = updateOrder;
// Get Orders Placed in the Last 7 Days
const getOrdersLast7Days = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        // Query using the createdAt index
        const orders = yield order_1.Order.find({ orderDate: { $gte: sevenDaysAgo } })
            .populate([
            { path: "user", select: "name email" },
            { path: "products.product", select: "name category price" },
        ])
            .lean(); // Use lean for better performance
        if (orders.length === 0) {
            res.status(404).json({ message: "No orders found in the last 7 days" });
            return;
        }
        res.status(200).json(orders);
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
exports.getOrdersLast7Days = getOrdersLast7Days;
// Get Orders for a Specific User
const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Validate user ID
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }
        // Fetch user's orders
        const orders = yield order_1.Order.find({ user: userId }).populate(populateOptions);
        if (orders.length === 0) {
            res.status(404).json({ message: "No orders found for this user" });
            return;
        }
        res.status(200).json(orders);
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
exports.getOrdersByUser = getOrdersByUser;
// Get User by Product
const getUsersByProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        // Validate MongoDB ObjectId for the product
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }
        // Use index for filtering by products.product
        const orders = yield order_1.Order.find({ "products.product": productId })
            .populate("user", "name email")
            .lean();
        if (orders.length === 0) {
            res.status(404).json({ message: "No users found who bought this product" });
            return;
        }
        const uniqueUsers = Array.from(new Set(orders.map((order) => JSON.stringify(order.user))))
            .map((user) => JSON.parse(user));
        res.status(200).json(uniqueUsers);
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
exports.getUsersByProduct = getUsersByProduct;
