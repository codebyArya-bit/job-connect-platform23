const mongoose = require('mongoose');

// In-memory storage for demo purposes
const inMemoryDB = {
  users: [],
  jobs: [],
  applications: []
};

const connectDB = async () => {
  try {
    // Try to connect to MongoDB first
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Using in-memory database for demonstration purposes');
    console.log('Note: Data will not persist between server restarts');
    
    // Set up in-memory database flag
    global.useInMemoryDB = true;
    global.inMemoryDB = inMemoryDB;
  }
};

module.exports = connectDB;