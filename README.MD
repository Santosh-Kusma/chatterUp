📘 Project Documentation – Real-time Chat App

📁 Tech Stack

- Backend: Node.js, Express, Socket.IO
- Frontend: HTML, CSS, JavaScript (vanilla), EJS templating
- Database: MongoDB (through Mongoose)
- UI Features: Typing indicators, online/offline detection, previous messages

📂 Project Structure (Suggested)

project/
│
├── config/
│ └── mongoose.config.js    # MongoDB connection setup
│
├── public/                 # Static assets (CSS, JS, images)
│
├── src/
│ ├── controller/
│ │ └── chat.controller.js  # Handles rendering chat view
│ ├── model/
│ │ └── chat.model.js       # DB logic for chats
│ └── views/
│ └── index.ejs             # Main chat UI template
│
├── server.js               # Entry point (your provided code)
└── package.json

⚙️ Backend Logic

🔸 `server.js`

- Express Setup:

  - Uses EJS as templating engine.
  - Serves static files from `/public`.
  - On route `/`, renders the chat interface.

- Socket.IO Setup:

  - Listens for WebSocket connections.
  - Manages:

    - New user joins
    - Online users list
    - Typing indicators
    - Sending/receiving chat messages
    - Disconnect events

# Socket Events:

| Event | Direction | Description |
| `join-user` | Client → Server | Sent by client with username |
| `notify-online` | Server → Client | Broadcast to others when a user joins |
| `notify-offline` | Server → Client | Broadcast when user disconnects |
| `online-users` | Server → Client | Sends updated online users list |
| `send-message` | Client → Server | Chat message with metadata |
| `message` | Server → Client | Broadcasts new message to all others |
| `user-typing` | Client → Server | Typing indicator trigger |
| `typing` | Server → Client | Notifies others who is typing |
| `stop-typing` | Client → Server | Stop typing signal |
| `stopped-typing` | Server → Client | Clear typing display |
| `previous-messages` | Client → Server | Request for past messages |
| `load-prev-messages` | Server → Client | Sends previous messages |

🧠 Controller: `chat.controller.js`

Handles rendering the main chat UI using EJS.

js
getChatView(req, res) {
res.render("index");
}

🧾 Model: `chat.model.js`

Responsible for MongoDB interaction. Two main methods:

- `addChat(name, message, timeStamp, avatar)` → Saves new chat message.
- `loadPrevChats()` → Fetches past messages from DB.

🎨 Frontend Behavior

🔹 Join Flow

- Prompt user for name (loop until valid).
- Emit `join-user` event to notify server.

🔹 Toast Notifications

- Shows custom messages (like "User joined/left") using a CSS-styled toast.

🔹 Chat Functionality

- Show previous messages from DB on load.
- Self and broadcast messages styled differently.

🔹 Typing Indicator

- `keypress` event sends `user-typing`.
- `click` anywhere emits `stop-typing`.

🔸 CSS (for toast, chat, etc.)

🧪 Testing

- Open two different browser tabs.
- Join chat with different usernames.
- Test typing indicator, online/offline status, and message sync.

🚀 Run Instructions

1.  Install Dependencies

npm install

2.  Start Server

node server.js

Make sure MongoDB is running and accessible via your config.

📦 Dependencies

Add these to your `package.json` if not already:

json
 "dependencies": {
    "cors": "^2.8.5",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "mongoose": "^8.15.1",
    "socket.io": "^4.8.1"
  }
