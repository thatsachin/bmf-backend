import Flight from "../model/flightSchema.js";
import BookedFlight from "../model/bookedFlightSchema.js";
import connectToDB from "../connectToDB.js";
import { instance } from "../index.js";
import crypto from "crypto";

const FlightBooking = async (req, res) => {
    const { flightId, choosenSeats } = req.body;
    const { _id } = req.user;

    if(!flightId || !choosenSeats) {
        return res.status(200).json({
            "success": false,
            "message": "All fields are required!"
        })
    }

    connectToDB();
    const getFlightPrice  = await Flight.findOne({_id: flightId});

    const options = {
        amount: Number((getFlightPrice.price*choosenSeats.length)*100),
        currency: "INR"
    };
    const order = await instance.orders.create(options);

    const alreadyBookedFlight = await BookedFlight.findOne({flightId, userId: _id});

    if(alreadyBookedFlight) {
        if(alreadyBookedFlight.paymentStatus && alreadyBookedFlight.seatNumber === choosenSeats) {  
            return res.status(200).json({
                "success": false,
                "message": "Flight/Seat is already booked!"
            })
        }
        else {
            alreadyBookedFlight.orderId = order.id;
            alreadyBookedFlight.amountPaid = alreadyBookedFlight.amountPaid + (getFlightPrice.price*choosenSeats.length);
            alreadyBookedFlight.seatNumber = alreadyBookedFlight.seatNumber.filter(seat => !choosenSeats.includes(seat));
            alreadyBookedFlight.seatNumber = alreadyBookedFlight.seatNumber.concat(choosenSeats);
            await alreadyBookedFlight.save();
        }
    }
    else {
        const bookedFlight = new BookedFlight({
            userId: _id,
            flightId,
            seatNumber: choosenSeats,
            orderId: order.id,
            amountPaid: getFlightPrice.price*choosenSeats.length
        });
        await bookedFlight.save();
    }

    
    if(getFlightPrice) {
        // const flight = await Flight.findOne({_id: flightId});
        // flight.bookedSeats = flight.bookedSeats.concat(choosenSeats);
        // await flight.save();

        return res.status(200).json({
            "success": true,
            "order": order
        })
    } else {
        return res.status(200).json({
            "success": false,
        })
    }
}

export default FlightBooking;

export const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    // console.log("expectedSignature: ", expectedSignature);
    // console.log("razorpay_signature: ", razorpay_signature);

    const getFalseBooking = await BookedFlight.findOne({ orderId: razorpay_order_id });
    const deleteBookedSeat = await Flight.findOne({ _id: getFalseBooking.flightId });

    if(isAuthentic) {
        const bookedFlight = await BookedFlight.findOne({ orderId: razorpay_order_id });
        bookedFlight.paymentStatus = true;
        bookedFlight.paymentRefId = razorpay_payment_id;
        await bookedFlight.save();

        deleteBookedSeat.bookedSeats = deleteBookedSeat.bookedSeats.concat(getFalseBooking.seatNumber); 
        await deleteBookedSeat.save();

        return res.redirect(`${process.env.FRONTEND_URL}/success?ref=${razorpay_payment_id}`);
    }
    else {
        if(deleteBookedSeat) {
            deleteBookedSeat.bookedSeats = deleteBookedSeat.bookedSeats.filter(seat => !getFalseBooking.seatNumber.includes(seat));
            await deleteBookedSeat.save();
        }

        await BookedFlight.deleteOne({ orderId: razorpay_order_id });

        return res.status(200).json({ success: false, message: "Payment Failed!" })
        // return res.redirect(`${process.env.FRONTEND_URL}/failure`);
    }
}