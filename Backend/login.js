const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser'); // Import bodyParser module

const app = express();
const port = 3000;

const uri = 'mongodb+srv://admin:admin123@finprohci.hieclio.mongodb.net/';
const dbName = 'FinproHCI';
const collectionName = 'username';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json()); // Use bodyParser for JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Use bodyParser for URL-encoded data

// MongoDB Connection
let client;

async function connectToDatabase() {
    try {
        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to the database");
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
}

connectToDatabase();

// Generate random 8-digit verification code
function generateVerificationCode() {
    const token = crypto.randomBytes(4).toString('hex').toUpperCase();
    console.log("Generated token:", token);
    return token;
}

// Store the generated verification code
let expectedVerificationCode;

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!client) {
        res.status(500).send("Error: Database connection not established.");
        return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    try {
        console.log("Searching for user with username:", username); // Add this line
        const user = await collection.findOne({ username });

        if (!user) {
            // If user is not found with the provided username
            res.send({ success: false, message: "User not found." });
            return;
        }

        // If user is found, check password
        if (user.password === password) {
            // Generate and store verification code
            expectedVerificationCode = generateVerificationCode();

            res.send({ success: true });
        } else {
            res.send({ success: false, message: "Invalid password." });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send({ success: false, message: "Error during login." });
    }
});

// Verification Route
app.post('/verify', async (req, res) => {
    const { verificationCode } = req.body;

    if (verificationCode === expectedVerificationCode) {
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }
});

// Serve login.html for GET request to "/login"
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve verification.html for GET request to "/verification"
app.get('/verification', (req, res) => {
    res.sendFile(path.join(__dirname, 'verification.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
