const express = require("express");
const router = express.Router();

const authController = require("./../Controllers/authController");
const orderController = require("./../Controllers/orderController");

router
  .route("/")
  .get(authController.protectBoth, orderController.getAllOrders)
  .post(
    authController.protectCustomer,
    orderController.setUserIds,
    orderController.createOrder
  );

module.exports = router;
