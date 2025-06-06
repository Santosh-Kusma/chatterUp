import mongoose from "mongoose";
import { chatSchema } from "../../schema/chat.schema.js";

const Chat = mongoose.model("Chat", chatSchema);
export default class ChatModel {
  async addChat(name, message, timeStamp, avatar) {
    try {
      const newChat = new Chat({ name, avatar, message, timeStamp });
      const savedChat = await newChat.save();
      return savedChat;
    } catch (err) {
      console.log(err);
    }
  }

  async loadPrevChats() {
    try {
      // load last 50 messages
      let chats = await Chat.find().sort({ timeStamp: -1 }).limit(50).lean();
      // show chats in ascending order - (scroll chats from below to top)
      return chats.reverse();
    } catch (err) {
      console.log(err);
    }
  }
}
