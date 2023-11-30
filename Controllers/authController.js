const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const protectRole = (role) =>
  catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // if the token is not send back
    if (!token) {
      return next(new AppError("Not logged in!", 401));
    }
    // if the token is wrong
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("Token belong to the user is not exist", 401));
    }

    // Use this when listing orders
    if (role === "listOrder") {
      if (currentUser.role === "customer") {
        req.body.createdBy = currentUser._id;
      }
    }
    // Use this when you want to ensure role match required role
    else if (
      currentUser.role === "manager" ||
      currentUser.role === "customer"
    ) {
      if (currentUser.role !== role) {
        return next(new AppError("User is not a " + role, 401));
      }
    }

    req.user = currentUser;
    next();
  });

// Middleware to protect routes accessible only by managers
exports.protectManager = protectRole("manager");

// Middleware to protect routes accessible only by customers
exports.protectCustomer = protectRole("customer");

// Middleware to protect routes accessible only by managers and customers itself
exports.protectBoth = protectRole("listOrder");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
const createSendToken = (status, user, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(status).json({ status: "success", token, user });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  createSendToken(200, newUser, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Enter Email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect mail or password", 400));
  }

  createSendToken(200, user, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {});
  res.status(200).json({ status: "success", message: "logout" });
};
