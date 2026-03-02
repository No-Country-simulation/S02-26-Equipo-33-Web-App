

import mongoose from "mongoose";

//const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DB_NAME } = process.env;


// https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial
// import { MongoClient } from "mongodb";
// const connectionString = process.env.ATLAS_URI || "";
// const client = new MongoClient(connectionString);
// let conn;
// try {
//   conn = await client.connect();
// } catch(e) {
//   console.error(e);
// }
// let db = conn.db("sample_training");
// export default db;

const connectDB = async (): Promise<void> => {

  const uri = process.env.MONGO_URI as string

  if (!uri) throw new Error("MONGO_URI is not defined in environment variables");
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✔ MongoDB connected: ${conn.connection.host}`);
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting reconnect...");
    });
  } catch (error) {
    console.error("MongoDB initial connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;

