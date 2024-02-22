import connectToDB from "./connectToDB.js";
import { faker } from '@faker-js/faker';
import Flight from "./model/flightSchema.js";
import moment from "moment";

// Specify cities for fake flights
const cities = ['Mumbai', 'Bangalore', 'Pune', 'Delhi', 'Gujarat'];

// Specify airlines
const airlines = [
    { name: 'AirAkasa AirLines', code: 'AA' },
    { name: 'JetAirways Airlines', code: 'JA' },
    { name: 'Bharat Airlines', code: 'BA' },
    { name: 'Spicejet Airways', code: 'SA' },
    { name: 'Go Airways', code: 'GA' },
    { name: 'Kingfisher Airlines', code: 'KA' }
];                                                                

async function generateFakeFlightData(req, res) {
    try {
        // Connect the client to the server
        await connectToDB();
        const flight = Flight;
        
        // Remove flights for today
        const today = new Date();
        // const tomorrow = new Date(today);
        // tomorrow.setDate(today.getDate() + 1);
        // await flight.deleteMany({ date: { $lt: tomorrow } });

        // Generate and insert fake flights for the next 7 days
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        // const formattedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let flights = [];
        for (let date = new Date(today); date < endDate; date.setDate(date.getDate() + 1)) {
            cities.forEach(from => {
                cities.forEach(to => {
                    if (from !== to) {
                        const airline = airlines[Math.floor(Math.random() * airlines.length)];
                        const airlineCode = `${airline.code}-${faker.number.int({ min: 1000, max: 9999 })}`;
                        const flightDate = moment(new Date(date), 'YYYY-MM-DD').format('YYYY-MM-DD');
                        const price = faker.number.int({ min: 3000, max: 10000 });
                        const totalSeats = faker.number.int({ min: 30, max: 60 });
                        flights.push({ from, to, date: flightDate, price, airline: airline.name, airlineCode, totalSeats });
                    }
                });
            });
        }

        await flight.insertMany(flights);
        // await flight.deleteMany({});
        res.send("Fake flights generated and inserted successfully");
        console.log("Generated and inserted fake flights successfully");
    } catch (err) {
        console.log(err.stack);
    }
}

export default generateFakeFlightData;
