import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
};
