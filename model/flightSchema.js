import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    airline: {
        type: String,
        required: true
    },
    airlineCode: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    bookedSeats: {
        type: [Number],
        default: []
    }
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
