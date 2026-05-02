import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to .env.local');
}

let cached = global.mongoose;
if (!cached || !cached.connection.readyState) {
  cached = global.mongoose = { conn: null, promise: null };
}

if (!cached.promise) {
  const opts = {
    bufferCommands: false,
    maxPoolSize: 10,
  };
  cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then(mongoose => {
    return mongoose;
  });
}
export default cached.promise;