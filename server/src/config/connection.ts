import mongoose from 'mongoose';

const options = {
  ssl: true,
  tls: true,
  tlsCAFile: undefined,
  tlsAllowInvalidHostnames: false,
  tlsAllowInvalidCertificates: false,
  retryWrites: true,
  w: 'majority',
  minPoolSize: 1,
  maxPoolSize: 10
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', options);

export default mongoose.connection;
