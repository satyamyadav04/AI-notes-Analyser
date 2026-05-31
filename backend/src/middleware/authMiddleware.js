import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const protect = asyncHandler(async (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    const error = new Error("Not authorized, token missing.");
    error.statusCode = 401;
    throw error;
  }

  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    const error = new Error("Not authorized, user not found.");
    error.statusCode = 401;
    throw error;
  }

  next();
});

export default protect;
