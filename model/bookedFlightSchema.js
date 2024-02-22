import mongoose from "mongoose";

const bookedFlightSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    seatNumber: {
        type: [Number],
        default: []
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    orderId : {
        type: String,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paymentRefId: {
        type: String
    }
});

const BookedFlight = mongoose.model('BookedFlight', bookedFlightSchema);

export default BookedFlight;
