const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/googlebooks';
mongoose.connect(MONGODB_URI); 