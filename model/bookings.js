import mongoose from "mongoose"


const bookingSchema = new mongoose.Schema({
    from: String,
    to:String,
    category:String,
    user: Object,
    createdAt: {
        type: Date,
        default: Date.now
    },
    acceptedBy:Object,
    accpetedAt: {
        type: Date,
        default: Date.now
    }
})

export const Booking = mongoose.model("bookings", bookingSchema)