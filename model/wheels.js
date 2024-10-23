import mongoose from "mongoose";

const wheelsSchema = new mongoose.Schema({
  email: String,
  driverName: String,
  driverImage: String,
  category: String,
  vehicleName: String,
  vehicleImage: String,
  vehicleRegNumber: String,
  password: String,
  rating: { type: Number, default: 4 },
});

export const Wheels = mongoose.model("wheels", wheelsSchema);
