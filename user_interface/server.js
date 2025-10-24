// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 3001;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Temporary in-memory storage (replace with DB later)
let users = []; // { username, password }
let messages = []; // { username, text }

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- REST API ---

// Sign up / register
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: "User exists" });
  }
  users.push({ username, password });
  res.json({ success: true });
});

// Sign in / login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
  res.json({ success: true });
});

// Get messages
app.get("/messages", (req, res) => {
  res.json(messages);
});

// --- Socket.IO for real-time messaging ---
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send current messages when user connects
  socket.emit("load_messages", messages);

  // Listen for new messages
  socket.on("send_message", (msg) => {
    messages.push(msg);         // save in memory
    io.emit("receive_message", msg); // broadcast to all clients
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
