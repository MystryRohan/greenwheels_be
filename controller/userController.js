import { User } from "../model/user.js";
import { Booking } from "../model/bookings.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/utils.js";
import { RentWheels } from "../model/rent.js";

export const registerUser = async (req, res) => {
  const { name, email, phone, password, address } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    // console.log(User.findOne({ email: email }));
    return res.json({ success: false, message: "User already exists" });
  }
  try {
    const hpass = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      phone,
      password: hpass,
      address,
    });
    // return res.json({ status: true, message: "User created successfully" });
    createToken(200, req, res, user, "User created successfully");
  } catch (err) {
    return res.json({
      success: false,
      message: "User Registration Failed...",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({ success: false, message: "User not found" });
  }
  const hpass = await bcrypt.compare(password, user.password);

  if (!hpass) {
    return res.status(200).json({
      success: false,
      message: "Email or Password is incorrect",
    });
  }
  createToken(200, req, res, user, "User logged in successfully");
};

export const userProfile = (req, res) => {
  res.json({ success: true, user: req.user });
};
export const updateProfile = async (req, res) => {
  try {
    const { name, address, phone } = req.body;

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        name,
        address,
        phone,
      },
      { new: true }
    );

    res.json({ success: true, message: "Profile updated successfully" });
  } catch {
    return res.status(200).json({ success: false, message: "User not found" });
  }
};

export const bookRide = async (req, res) => {
  const { from, to } = req.body;
  let booking = await Booking.create({
    from,
    to,
    user: req.user,
    createdAt: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "Finding you wheels...",
  });
};
export const rentRide = async (req, res) => {
  const {
    email,
    name,
    category,
    vehicleName,
    vehicleImage,
    vehicaleRegNumber,
  } = req.body;
  try {
    let { user } = await RentWheels.create({
      email,
      name,
      category,
      vehicleName,
      vehicleImage,
      vehicaleRegNumber,
    });
    res.json({
      success: true,
      message: "Wheels added successfully for rental...",
    });
  } catch {
    res.json({ success: false, message: "Failed, try again" });
  }
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("logged", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.MODE === "Dev" ? "lax" : "none",
      secure: process.env.MODE === "Dev" ? false : true,
    })
    .json({
      success: true,
      message: "logged out successfully",
    });
};
