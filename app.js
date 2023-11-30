const authRoute = require("./Routes/authRoute");
const productRoute = require("./Routes/productRoute");
const orderRoute = require("./Routes/orderRoute");

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/products", productRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/users", authRoute);

module.exports = app;
