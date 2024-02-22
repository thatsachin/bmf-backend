import express from "express";
import "dotenv/config";
import authRouter from "./router/authRouter.js";
import generateFakeFlightData from "./generateFakeFlightData.js";
import FlightBooking from "./controller/flightBooking.js";
import FlightSearch from "./controller/flightSearch.js";
import AuthChecker from "./middleware/authChecker.js";
import GetFlightData from "./controller/getFlightData.js";
import GetAllBookings from "./controller/getAllBookings.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import { paymentVerification } from "./controller/flightBooking.js";
import GetBookedTicketData from "./controller/getBookedTicketData.js";

const app = express();

const PORT = 8000 || process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

const KEY_ID = process.env.KEY_ID;
const KEY_SECRET = process.env.KEY_SECRET;

export const instance = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
}));
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Hello World from Backend");
});

app.get("/gen", generateFakeFlightData);

app.post("/api/v1/flight/book", AuthChecker, FlightBooking);
app.post("/api/v1/flight/get-booked-ticket-data", AuthChecker, GetBookedTicketData);

app.post("/api/v1/flight/search", AuthChecker, FlightSearch);
app.post("/api/v1/flight/get-flight-data", AuthChecker, GetFlightData);
app.get("/api/v1/flight/get-all-bookings", AuthChecker, GetAllBookings);
app.post("/api/v1/flight/payment-verification", paymentVerification);
app.get("/api/v1/flight/get-api-key", AuthChecker, (req, res) => {
    return res.status(200).json({ success: true, key: KEY_ID }); 
 });


app.listen(PORT, () => {
    console.log("Listening to port: "+PORT);
});