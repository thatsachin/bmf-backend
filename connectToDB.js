import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        if(mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.DB_URL);
            // console.log("Connected to DB");
        }
    } catch(error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

export default connectToDB