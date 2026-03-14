import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


// env config

dotenv.config({
    path: "./.env",
});



const PORT = process.env.PORT || 8000;



connectDB()
    .then(() => {

        app.listen(PORT, () => {
            console.log(`⚙️ Server running on port ${PORT}`);
        });

    })
    .catch((err) => {
        console.log("❌ MongoDB connection failed:", err);
    });
