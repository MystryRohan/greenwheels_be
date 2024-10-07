import mongoose from "mongoose";

const RentSchema = new mongoose.Schema({
  email: String,
  name: String,
  category: String,
  vehicleName: String,
  vehicleImage: String,
  vehicleRegNumber: String,
  rentedBy: { type: Object, default: null },
});

export const RentWheels = mongoose.model("rentwheels", RentSchema);
