const mongoose = require("mongoose");

function connectDB(){
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables");
        process.exit(1);
    }
    console.log("Attempting to connect to MongoDB",);

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
        console.error("Please check your .env file and MongoDB connection string");
        process.exit(1);
    });
}

module.exports = connectDB;
