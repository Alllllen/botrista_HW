const Product = require("./../Models/productModel");
const Order = require("./../Models/orderModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");
const crud = require("./crudAction");

exports.setUserIds = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  next();
});

exports.checkOrdered = catchAsync(async (req, res, next) => {
  const query = Product.findById(req.params.id);
  const doc = await query;

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  // Check if product has any associated orders
  const orders = await Order.find({
    "products.product_id": req.params.id,
  });

  if (orders.length > 0) {
    return next(
      new AppError("Cannot delete product that has existing orders.", 404)
    );
  }
  next();
});

exports.getAllProducts = crud.getAll(Product);
exports.createProduct = crud.createOne(Product);
exports.deleteProduct = crud.deleteOne(Product);
exports.getProduct = crud.getOne(Product);
exports.updateProduct = crud.updateOne(Product);
