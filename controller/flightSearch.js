import Flight from "../model/flightSchema.js";
import connectToDB from "../connectToDB.js";
import moment from "moment";

const FlightSearch = async (req, res) => {
    const { from, to, date } = req.body;

    if(!from || !to || !date) {
        return res.status(200).json({
            "success": false,
            "message": "All fields are required!"
        })
    }

    // Parsing date string from frontend and format it to match MongoDB date format
    // const formattedDate = moment(date, 'YYYY-MM-DD').toDate();
    //const formattedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');

    connectToDB();
    const availableFlights  = await Flight.find({from, to, date});

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

export default FlightSearch;