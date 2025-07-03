const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.connect('mongodb+srv://harshrajput369:ApjBecNLOFwtIEkF@crm.8uzp2.mongodb.net/?retryWrites=true&w=majority&appName=CRM')
        .then(() => {
            console.log("Successfully connected to MongoDB");
          })
        // console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
