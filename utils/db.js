import mongoose, { connect } from "mongoose";

const MongoDBUrl = process.env.MONGODB_URL || "";

export default async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  try {
    await connect(MongoDBUrl); //, {useNewUrlParser: true, useUnifiedTopology: true}
  } catch (error) {
    throw new Error("💥Error connecting to Mongoose", error);
  }
}
