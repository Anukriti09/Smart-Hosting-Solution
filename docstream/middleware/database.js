import mongoose from 'mongoose';

const db = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  // Must add a connection url for the MongoDB in .env.local
  await mongoose.connect("mongodb+srv://docstream:docstream@cluster0.vyiaiur.mongodb.net/?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log('db connection established');
  return handler(req, res);
};

export default db;