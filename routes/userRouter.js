import express from "express";
import {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  bookRide,
  rentRide,
  logout,
} from "../controller/userController.js";
import { isAuthenticated } from "../utils/utils.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", isAuthenticated, userProfile);
userRouter.put("/update", isAuthenticated, updateProfile);
userRouter.post("/bookwheels", isAuthenticated, bookRide);
userRouter.post("/rentwheels", isAuthenticated, rentRide);
userRouter.get("/logout", isAuthenticated, logout);

export default userRouter;
