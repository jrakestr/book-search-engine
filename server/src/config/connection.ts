import mongoose from 'mongoose';

import type { ConnectOptions } from 'mongoose';

const options: ConnectOptions = {
  ssl: true,
  retryWrites: true,
  minPoolSize: 1,
  maxPoolSize: 10
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', options);

export default mongoose.connection;
