import { User } from "../model/user.js";
import { Booking } from "../model/bookings.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/utils.js";
import { RentWheels } from "../model/rent.js";
import { Wheels } from "../model/wheels.js";

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
  return res.json({ success: true, user: req.user });
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
  return res.status(200).json({
    success: true,
    message: "Finding you wheels...",
    id: booking._id,
  });
};

export const isRideAccepted = async (req, res) => {
  try {
    // console.log("req.params:", req.params);
    const { id } = req.params;

    // console.log(id);
    const rideAccepted = await Booking.findById(id);
    // console.log(rideAccepted);
    if (rideAccepted.acceptedBy !== null) {
      return res.json({
        success: true,
        message: rideAccepted,
      });
    }
    return res.json({
      success: false,
      message: "No Wheels Available",
    });
  } catch (e) {
    console.log("finding");
    return res.json({ success: false, message: e });
  }
};
export const getDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Wheels.findById(id);
    return res.json({ success: true, message: driver });
  } catch (e) {
    return res.json({ success: false, message: "" });
  }
};

const getPaginatedData = async (req, page) => {
  let perPage = 5;
  return await Booking.find({ user: req.user })
    .sort({ createdAt: "descending" })
    .lean()
    .limit(perPage)
    .skip(page * perPage);
};

export const myfares = async (req, res) => {
  try {
    const id = req.user._id.toString();
    let page = req.query.page;

    const data = await getPaginatedData(req, page);
    // console.log(data);
    return res.json({
      success: true,
      message: data,
    });
  } catch (e) {
    return console.log("err", e);
  }
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
    return res.json({
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
