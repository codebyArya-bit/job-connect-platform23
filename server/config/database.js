const mongoose = require('mongoose');

// In-memory storage for demo purposes
const inMemoryDB = {
  users: [],
  jobs: [],
  applications: []
};

const connectDB = async () => {
  if (!global.__jobconnectMongoose) {
    global.__jobconnectMongoose = { conn: null, promise: null, eventsAttached: false };
  }

  try {
    if (global.__jobconnectMongoose.conn) {
      return global.__jobconnectMongoose.conn;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }

    if (!global.__jobconnectMongoose.promise) {
      global.__jobconnectMongoose.promise = mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
      });
    }

    const conn = await global.__jobconnectMongoose.promise;
    global.__jobconnectMongoose.conn = conn;

    if (!global.__jobconnectMongoose.eventsAttached) {
      global.__jobconnectMongoose.eventsAttached = true;
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      if (!process.env.VERCEL) {
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
      }
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Using in-memory database for demonstration purposes');
    console.log('Note: Data will not persist between server restarts');
    
    // Set up in-memory database flag
    global.useInMemoryDB = true;
    global.inMemoryDB = inMemoryDB;
    global.__jobconnectMongoose.conn = null;
    global.__jobconnectMongoose.promise = null;
    return null;
  }
};

module.exports = connectDB;
