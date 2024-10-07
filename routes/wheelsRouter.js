import express from "express";
import {
  wheelsRegister,
  wheelsLogin,
  wheelsProfile,
  acceptFare,
  rejectFare,
  getFares,
  logout,
  getWheelsOnRent,
  getWheelsAvailableForRent,
} from "../controller/wheelsController.js";
import { isWheelsAuthenticated } from "../utils/utils.js";

const wheelsRouter = express.Router();

wheelsRouter.post("/register", wheelsRegister);
wheelsRouter.post("/login", wheelsLogin);
wheelsRouter.get("/profile", isWheelsAuthenticated, wheelsProfile);
wheelsRouter.post("/acceptfare/:id", isWheelsAuthenticated, acceptFare);
wheelsRouter.post("/rejectfare/:id", isWheelsAuthenticated, rejectFare);
wheelsRouter.get(
  "/getwheelsavailableforrent",
  isWheelsAuthenticated,
  getWheelsAvailableForRent
);

wheelsRouter.post(
  "/getwheelsonrent/:id",
  isWheelsAuthenticated,
  getWheelsOnRent
);
wheelsRouter.get("/getfares", isWheelsAuthenticated, getFares);
wheelsRouter.get("/logout", isWheelsAuthenticated, logout);

export default wheelsRouter;
