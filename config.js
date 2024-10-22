const mongoose = require("mongoose"); // Fix: Use `=` instead of `required`
const connect = mongoose.connect("mongodb://localhost:27017/fsd", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check if the database is connected or not
connect.then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log("Database connection failed:", err); // Added error logging
    });

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Collection Part
const collection = mongoose.model("users", LoginSchema); // Fix: Use `mongoose.model` instead of `new mongoose.model`
module.exports = collection; // Fix: Use `=` instead of `-` for exporting the module