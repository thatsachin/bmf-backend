import Flight from "../model/flightSchema.js";
import connectToDB from "../connectToDB.js";

const GetFlightData = async (req, res) => {
    const { id } = req.body;

    if(!id) {
        return res.status(200).json({
            "success": false,
            "message": "All fields are required!"
        })
    }

    connectToDB();
    const availableFlights  = await Flight.findOne({_id: id});

    if (availableFlights.length === 0) {
        return res.status(200).json({
            "success": false,
            "message": "No flights are available!"
        })
    }

    return res.status(200).json({
        "success": true,
        "message": "Flights found successfully!",
        "data": availableFlights
    })
}

export default GetFlightData;