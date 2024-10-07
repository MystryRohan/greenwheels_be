import jwt from "jsonwebtoken";
import { User } from "../model/user.js";
import { Wheels } from "../model/wheels.js";

export const createToken = (statusCode, req, res, user, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res
    .status(statusCode)
    .cookie("logged", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
      sameSite: process.env.MODE === "Dev" ? "lax" : "none",
      secure: process.env.MODE === "Dev" ? false : true,
    })
    .json({
      success: true,
      message,
    });
  req.user = user;
};

export const isAuthenticated = async (req, res, next) => {
  const { logged } = req.cookies;
  if (!logged) {
    return res.status(200).json({
      success: false,
      message: "Please login first",
    });
  }
  const token = jwt.verify(logged, process.env.JWT_SECRET);
  req.user = await User.findById(token._id);
  next();
};

export const createWheelsToken = (statusCode, req, res, wheels, message) => {
  const token = jwt.sign({ _id: wheels._id }, process.env.JWT_SECRET);
  res
    .status(statusCode)
    .cookie("wheelslogged", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
      sameSite: process.env.MODE === "Dev" ? "lax" : "none",
      secure: process.env.MODE === "Dev" ? false : true,
    })
    .json({
      success: true,
      message,
    });
  req.wheels = wheels;
};

export const isWheelsAuthenticated = async (req, res, next) => {
  const { wheelslogged } = req.cookies;
  if (!wheelslogged) {
    return res.status(200).json({
      success: false,
      message: "Please login first",
    });
  }
  const token = jwt.verify(wheelslogged, process.env.JWT_SECRET);
  req.wheels = await Wheels.findById(token._id);
  next();
};
