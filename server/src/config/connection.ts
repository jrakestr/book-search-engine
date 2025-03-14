import mongoose from 'mongoose';

// Enable mongoose debug mode
mongoose.set('debug', true);

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';
    console.log('Attempting to connect to MongoDB...', { uri });

    // Determine if we're connecting to a remote database (likely MongoDB Atlas)
    const isRemoteConnection = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('127.0.0.1');
    
    // Only use SSL options for remote connections
    const connectionOptions = isRemoteConnection 
      ? {
          retryWrites: true,
          ssl: true,
          tls: true,
          tlsInsecure: true, // For testing only
          minPoolSize: 1,
          maxPoolSize: 10
        }
      : {
          retryWrites: true,
          minPoolSize: 1,
          maxPoolSize: 10
        };

    await mongoose.connect(uri, connectionOptions);

    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Connect to the database
connectDB();

export default mongoose.connection;
