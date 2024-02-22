import BookedFlight from "../model/bookedFlightSchema.js";
import connectToDB from "../connectToDB.js";

const GetAllBookings = async (req, res) => {
    const { _id } = req.user;

    connectToDB();
    const allBookings  = await BookedFlight.find({userId: _id});

    if (allBookings.length === 0) {
        return res.status(200).json({
            "success": false,
            "message": "No flights are available!"
        })
    }

    return res.status(200).json({
        "success": true,
        "message": "Bookings Data found successfully!",
        "data": allBookings
    })
}

export default GetAllBookings;