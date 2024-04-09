const { MongoClient } = require('mongodb');
const fs = require('fs');

// Connection URI
const uri = 'mongodb+srv://admin:admin123@finprohci.hieclio.mongodb.net/';

// Database Name
const dbName = 'FinproHCI';
const collectionName = 'username';

async function uploadUserData(username, password, verification, imagePath) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to the MongoDB cluster');

    // Access the database
    const database = client.db(dbName);

    // Access the collection
    const collection = database.collection(collectionName);

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ username: username });
    if (existingUser) {
      console.error('Username already exists.');
      return; // Exit function if the username already exists
    }

    // Read the image file as binary data
    const imageStats = fs.statSync(imagePath);
    const imageSizeInMB = imageStats.size / (1024 * 1024); // Convert bytes to megabytes
    if (imageSizeInMB > 15) {
      console.error('Image size exceeds the maximum allowed limit of 15 MB.');
      return; // Exit function if the image size exceeds the limit
    }

    const imageBuffer = fs.readFileSync(imagePath);

    // Insert user data into the database
    await collection.insertOne({
      username: username,
      password: password,
      verification: verification,
      image: imageBuffer
    });

    console.log('User data uploaded successfully for user:', username);

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Disconnected from the MongoDB cluster');
  }
}

// Call the uploadUserData function with the username, password, verification, and path to the image file
const username = 'Michella'; // Replace with the username
const password = 'kikigkjelas'; // Replace with the password
const verification = 'verified'; // Replace with the verification information
const imagePath = "testing.jpg"; // Replace with the actual path to your image
uploadUserData(username, password, verification, imagePath);
