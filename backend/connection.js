import mongoose from 'mongoose';
import "dotenv/config";

mongoose.connect(process.env.MONGO_URL,
).then(() => {
    console.log("Database connected successfully");
}).catch((error) => {
    console.error("Couldn't connect to database", error);
});

export default mongoose