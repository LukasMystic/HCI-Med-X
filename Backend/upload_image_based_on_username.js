const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Connection URI
const uri = 'mongodb+srv://admin:admin123@finprohci.hieclio.mongodb.net/';

// Database Name
const dbName = 'FinproHCI';
const collectionName = 'username'; // Collection name is 'username'

async function uploadImage(username, imagePath) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to the MongoDB cluster');

    // Access the database
    const database = client.db(dbName);

    // Access the collection
    const collection = database.collection(collectionName);

    // Check if the user already has an image
    const existingUser = await collection.findOne({ username: username });

    if (existingUser && existingUser.image) {
      // If the user has an existing image, prompt the user to confirm overwrite
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question(`User '${username}' already has an image. Do you want to overwrite it? (yes/no): `, async (answer) => {
        if (answer.toLowerCase() === 'yes') {
          // If the user confirms overwrite, upload the new image
          await uploadNewImage(username, imagePath, collection);
        } else {
          console.log('Image upload aborted.');
        }
        // Close the readline interface
        rl.close();
        // Close the MongoDB connection
        await client.close();
        console.log('Disconnected from the MongoDB cluster');
      });
    } else {
      // If the user does not have an existing image, upload the new image
      await uploadNewImage(username, imagePath, collection);
      // Close the MongoDB connection
      await client.close();
      console.log('Disconnected from the MongoDB cluster');
    }

  } catch (error) {
    console.error('Error occurred:', error);
  }
}

async function uploadNewImage(username, imagePath, collection) {
  // Read the image file as a buffer
  const imageBuffer = fs.readFileSync(imagePath);

  // Update or insert the user document with the new image
  await collection.updateOne(
    { username: username },
    { $set: { username: username, image: imageBuffer } },
    { upsert: true }
  );

  console.log('Image uploaded successfully for user:', username);
}

// Call the uploadImage function with the username and image path
const username = 'Testyop'; // Replace with the username
const imagePath = 'test.jpg'; // Replace with the path to the new image
uploadImage(username, imagePath);
