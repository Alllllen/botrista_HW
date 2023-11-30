const Order = require("./../Models/orderModel");
const Product = require("./../Models/productModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");
const crud = require("./crudAction");

exports.setUserIds = catchAsync(async (req, res, next) => {
  req.body.customer_id = req.user._id;
  next();
});

exports.createOrder = catchAsync(async (req, res, next) => {
  // Check stock for all products first
  for (const product of req.body.products) {
    const productDoc = await Product.findById(product.product_id);
    if (!productDoc) {
      return next(
        new AppError(`Product not found with ID: ${product.product_id}`, 404)
      );
    }

    // Check if the product has enough stock
    if (productDoc.stock < product.quantity) {
      return next(
        new AppError(`Not enough stock for product: ${product.product_id}`, 400)
      );
    }
  }

  // If all products have enough stock, create the order and deduct stock
  for (const product of req.body.products) {
    const productDoc = await Product.findById(product.product_id);

    // Deduct the ordered quantity from the product's stock
    productDoc.stock -= product.quantity;
    await productDoc.save();
  }

  // Create the order after checking stock for all products
  const order = await Order.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.getAllOrders = crud.getAll(Order);
exports.deleteOrder = crud.deleteOne(Order);
exports.getOrder = crud.getOne(Order);
exports.updateOrder = crud.updateOne(Order);
