import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectToDB } from "./config/mongoose.config.js";
import ChatContoller from "./src/controller/chat.controller.js";
import path from "path";
import ejs from "ejs";
import ChatModel from "../chatterUp/src/model/chat.model.js";
const chatModel = new ChatModel();
const chatController = new ChatContoller();

const app = express();
app.use(cors());

app.set("view engine", ejs);
app.set("views", path.resolve("src", "views"));
app.use(express.static("public"));

app.get("/", chatController.getChatView);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

let onlineUsers = [];
io.on("connection", (socket) => {
  console.log("connection made");

  // User joined
  let username;
  socket.on("join-user", (name) => {
    username = name;
    onlineUsers.push(name);
    socket.broadcast.emit("notify-online", name); // notify others
    io.emit("online-users", onlineUsers); // event to add in connected users
  });

  // Appear typing indicator
  socket.on("user-typing", name => {
    socket.broadcast.emit("typing", name);
  });
  // Disappear typing indicator
  socket.on("stop-typing", ()=>{
    io.emit("stopped-typing");
  })

  // load prev messages
  socket.on("previous-messages", async () => {
    const data = await chatModel.loadPrevChats();
    socket.emit("load-prev-messages", data);
  });

  // add new chat in the chat list
  socket.on("send-message", async (data) => {
    console.log(data);
    // add message in DB
    const newChat = await chatModel.addChat(
      data.name,
      data.message,
      data.timeStamp,
      data.avatar
    );
    if (newChat) {
      socket.broadcast.emit("message", {
        name: newChat.name,
        message: newChat.message,
        avatar: newChat.avatar,
        timeStamp: newChat.timeStamp,
      });
    }
  });

  socket.on("disconnect", () => {
    // User left
    onlineUsers = onlineUsers.filter((user) => user != username);
    socket.broadcast.emit("notify-offline", username);
    io.emit("online-users", onlineUsers);
    console.log("connection disconnected");
  });
});

const startServer = async () => {
  try {
    await connectToDB(); // ✅ First connect to DB
    server.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1); // Exit if DB is not ready
  }
};

startServer();