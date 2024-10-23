import { Wheels } from "../model/wheels.js";
import { Booking } from "../model/bookings.js";
import { createWheelsToken } from "../utils/utils.js";
import bcrypt from "bcrypt";
import { RentWheels } from "../model/rent.js";

export const wheelsLogin = async (req, res) => {
  const { email, password } = req.body;

  let wheels = await Wheels.findOne({ email });
  if (!wheels) {
    return res.status(404).json({
      success: false,
      message: "Register as Wheels first",
    });
  }
  const hpass = bcrypt.compare(password, wheels.password);
  if (!hpass) {
    return res.status(404).json({
      success: false,
      message: "Email or Password is incorrect",
    });
  }
  createWheelsToken(200, req, res, wheels, "Wheels logged in successfully");
};

export const wheelsRegister = async (req, res) => {
  const {
    driverName,
    email,
    driverImage,
    category,
    vehicleName,
    vehicleImage,
    vehicleRegNumber,
    password,
  } = req.body;
  let wheels = await Wheels.findOne({ email });
  if (wheels) {
    return res.status(200).json({
      success: false,
      message: "email already registered",
    });
  }
  try {
    const hpass = await bcrypt.hash(password, 10);
    let wheels = await Wheels.create({
      driverName,
      email,
      driverImage,
      category,
      vehicleName,
      vehicleImage,
      vehicleRegNumber,
      password: hpass,
    });
    createWheelsToken(200, req, res, wheels, "Wheels created successfully");
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Registeration Failed...",
    });
  }
};

export const wheelsProfile = (req, res) => {
  res.status(200).json({
    success: true,
    wheels: req.wheels,
  });
};

export const getFares = async (req, res) => {
  let bookings = await Booking.find();
  res.status(200).json({ message: bookings });
};

export const acceptFare = async (req, res) => {
  const bookingID = req.params.id;
  let booking = await Booking.findById(bookingID);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }
  booking.acceptedBy = req.wheels._id;
  booking.acceptedAt = new Date(Date.now());
  await booking.save();
  res.status(200).json({
    success: true,
    message: "Fare Accepted",
  });
};

export const rejectFare = async (req, res) => {
  const bookingID = req.params.id;
  let booking = await Booking.findById(bookingID);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }
  booking.acceptedBy = null;
  booking.accpetedAt = null;
  await booking.save();
  res.status(200).json({
    success: true,
    message: "Fare Rejected",
  });
};

export const getWheelsAvailableForRent = async (req, res) => {
  const wheels = await RentWheels.find();
  return res.status(200).json({ success: true, cars: wheels });
};

export const getWheelsOnRent = async (req, res) => {
  const wheelsID = req.params.id;
  let wheelsRented = await RentWheels.findById(wheelsID);

  wheelsRented.rentedBy = req.wheels;
  await wheelsRented.save();

  if (!wheelsRented) {
    return res.status(404).json({
      success: false,
      message: "Car not found",
    });
  }
  res.status(200).json({
    success: true,
    wheels: wheelsRented,
    message: "Car successfully rented!",
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("wheelslogged", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.MODE === "Dev" ? "lax" : "none",
      secure: process.env.MODE === "Dev" ? false : true,
    })
    .json({
      success: true,
      message: "logged out successfully",
    });
};
