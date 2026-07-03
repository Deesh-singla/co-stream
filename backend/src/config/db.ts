import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "co-stream",
        });

        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}