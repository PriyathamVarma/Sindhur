import mongoose from "mongoose";

type MongoCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongoCache: MongoCache | undefined;
}

const cache = globalThis._mongoCache ?? { conn: null, promise: null };
globalThis._mongoCache = cache;

mongoose.set("bufferCommands", false);

export const mongoDB = async () => {
  if (cache.conn && mongoose.connection.readyState === 1) return cache.conn;

  if (!cache.promise) {
    const uri = process.env.MONGODB_URI?.trim().replace(/^["']|["']$/g, "");
    if (!uri) throw new Error("MONGODB_URI is not set.");

    cache.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
        bufferCommands: false,
      })
      .then((m) => { cache.conn = m; return m; })
      .catch((err) => { cache.promise = null; cache.conn = null; throw err; });
  }

  return cache.promise;
};
