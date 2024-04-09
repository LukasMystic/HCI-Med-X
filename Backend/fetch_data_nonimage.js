const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://admin:admin123@finprohci.hieclio.mongodb.net/';

// Database Name
const dbName = 'FinproHCI';
const collectionName = 'username'; // Collection name is 'username'

async function fetchUserData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to the MongoDB cluster');

    // Access the database
    const database = client.db(dbName);

    // Access the collection
    const collection = database.collection(collectionName);

    // Exclude the 'image' field from the query
    const result = await collection.find({}, { projection: { image: 0 } }).toArray();

    // Output fetched user data
    console.log('Fetched user data (excluding image):');
    result.forEach(user => {
      console.log('Username:', user.username);
      console.log('Password:', user.password);
      console.log('Verification:', user.verification);
      console.log('----------------------');
    });

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Disconnected from the MongoDB cluster');
  }
}

// Call the fetchUserData function
fetchUserData();
