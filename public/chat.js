const socket = io.connect("http://localhost:3000");

let name = prompt("enter your name");

// prompt until recieve name
while (!name || name == "") {
  name = prompt("enter your name");
}
name = name.toLowerCase().trim();

// Greet user
const greet = document.getElementById("welcome-msg");
greet.innerText = `welcome ${name}`;

// event to add user in connected users list
socket.emit("join-user", name);

const connectedUsers = document.getElementById("online-users");
const usersCount = document.getElementById("users-count");
const body = document.querySelector("body");

socket.on("online-users", (users) => {
  connectedUsers.innerText = "";
  usersCount.innerText = "";
  for (let user of users) {
    const div = document.createElement("div");
    const onlineUser = document.createElement("div");
    const greenDot = document.createElement("div");
    div.className = "online-users-div";
    greenDot.className = "green-dot";
    onlineUser.innerText = user;
    div.append(greenDot, onlineUser);
    connectedUsers.append(div);
  }
  usersCount.innerText = users.length;
});

// Notify user online and offline to others
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
socket.on("notify-online", (name) => {
  showToast(`${name} has joined the chat`);
});
socket.on("notify-offline", (name) => {
  showToast(`${name} has left the chat`);
});

// show chats on front-end & parameter mainClass is used to define self-chat or broadcast
function showChat(data, mainClass) {
  const chatView = document.getElementById("chat-group");
  const chatDiv = document.createElement("div");
  const profile = document.createElement("img");
  const chatBox = document.createElement("div");
  const username = document.createElement("div");
  const text = document.createElement("div");
  const dateTime = document.createElement("div");
  chatDiv.className = mainClass;
  profile.className = "avatar";
  chatBox.className = "chat-box";
  username.className = "name";
  text.className = "text";
  dateTime.className = "timeStamp";
  username.innerText = data.name;
  text.innerText = data.message;
  profile.src = data.avatar;
  dateTime.innerText = new Date(data.timeStamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  chatBox.append(username, dateTime, text);
  chatDiv.append(profile, chatBox);
  chatView.insertAdjacentElement("afterbegin", chatDiv);
}

socket.emit("previous-messages");
socket.on("load-prev-messages", (data) => {
  for (let msg of data) {
    if (msg.name == name) {
      showChat(msg, "self-chat");
    } else {
      showChat(msg, "broadcast-chat");
    }
  }
});

const sendMsg = document.getElementById("send-btn");
const textMessage = document.getElementById("msg-box");
const msgTyping = document.getElementById("typing-view");

// Typing indicator
textMessage.addEventListener("keypress", () => {
  socket.emit("user-typing", name);
  msgTyping.innerText = `you are typing...`;
  // clear typing text on screen click
  body.addEventListener("click", () => {
    socket.emit("stop-typing");
  });
});
socket.on("typing", (name) => {
  msgTyping.innerText = `${name} typing...`;
});
socket.on("stopped-typing", () => {
  msgTyping.innerText = "";
});

// show and add message in DB
sendMsg.addEventListener("click", (e) => {
  const message = textMessage.value;
  const timeStamp = new Date().toLocaleString();
  const avatar = "https://i.pravatar.cc/150?u=" + name;
  const data = { message, name, timeStamp, avatar };
  // self messages
  showChat(data, "self-chat");
  // add message in DB
  socket.emit("send-message", {
    name: name,
    message,
    timeStamp,
    avatar,
  });
  textMessage.value = "";
});

// broadcast messages
socket.on("message", (data) => {
  showChat(data, "broadcast-chat");
});
