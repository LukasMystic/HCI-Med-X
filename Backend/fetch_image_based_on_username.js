const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Connection URI
const uri = 'mongodb+srv://admin:admin123@finprohci.hieclio.mongodb.net/';

// Database Name
const dbName = 'FinproHCI';
const collectionName = 'username'; // Collection name is 'username'

async function fetchAndSaveImage(username, outputPath) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to the MongoDB cluster');

    // Access the database
    const database = client.db(dbName);

    // Access the collection
    const collection = database.collection(collectionName);

    // Fetch the user document by username
    const user = await collection.findOne({ username: username });

    // Check if the user exists and has an image
    if (user && user.image) {
      // Write the image buffer to a file
      fs.writeFileSync(outputPath, user.image.buffer);
      console.log('Image saved successfully:', outputPath);
    } else {
      console.log('User not found or does not have an image.');
    }

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Disconnected from the MongoDB cluster');
  }
}

// Call the fetchAndSaveImage function with the username and output path
const username = 'Michella'; // Replace with the username
const outputPath = 'bambang.jpg'; // Replace with the path where you want to save the image
fetchAndSaveImage(username, outputPath);
