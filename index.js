const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));

// Render login page
app.get("/", (req, res) => {
    res.render("login");
});

// Render signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async(req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    try {
        // Check if the user already exists in the database
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.send("User already exists. Please choose a different username.");
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        // Insert new user data into the collection
        const userdata = await collection.insertMany([data]);
        console.log(userdata);
        res.send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
    }
});

// Login User
app.post("/login", async(req, res) => {
    try {
        // Find the user in the database by username
        const check = await collection.findOne({ name: req.body.username });
        if (!check) { // Fixed logic: `if (!check)` means user not found
            return res.send("Username not found");
        }

        // Compare the provided password with the hashed password from the database
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home"); // Render home page if login is successful
        } else {
            res.send("Wrong password");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});