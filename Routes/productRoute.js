const express = require("express");
const router = express.Router();

const authController = require("./../Controllers/authController");
const productController = require("./../Controllers/prodcutController");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protectManager,
    productController.setUserIds,
    productController.createProduct
  );
router
  .route("/:id")
  .delete(
    authController.protectManager,
    productController.checkOrdered,
    productController.deleteProduct
  )
  .patch(authController.protectManager, productController.updateProduct);

module.exports = router;
