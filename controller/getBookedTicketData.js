import BookedFlight from "../model/bookedFlightSchema.js";
import Flight from "../model/flightSchema.js";
import connectToDB from "../connectToDB.js";

const GetBookedTicketData = async (req, res) => {
    const { refId } = req.body;

    if(!refId) {
        return res.status(200).json({
            "success": false,
            "message": "Reference is required!"
        })
    }

    connectToDB();

    const bookedFlight = await BookedFlight.findOne({paymentRefId: refId});
    if(!bookedFlight) {
        return res.status(200).json({
            "success": false,
            "message": "No data found!"
        })
    }

    const getFlightData  = await Flight.findOne({ _id: bookedFlight.flightId });
    if(!getFlightData) {
        return res.status(200).json({
            "success": false,
            "message": "No data found!"
        })
    }

    return res.status(200).json({
        "success": true,
        "airline": getFlightData.airline,
        "airlineCode": getFlightData.airlineCode,
        "origin": getFlightData.from,
        "destination": getFlightData.to,
        "date": getFlightData.date,
        "seatBooked": bookedFlight.seatNumber,
        "amount": bookedFlight.seatNumber.length*getFlightData.price

    })

}

export default GetBookedTicketData;