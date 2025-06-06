import mongoose from "mongoose";

export const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  avatar: String,
  message: {
    type: String,
    trim: true,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
});
