import React, { useState, useEffect } from "react";
import logo from "./transparent_logo2.png";
import "./App.css";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // connect to Socket.IO server

function Home() {
  const location = useLocation();
  const username = location.state?.username || "Guest";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load messages and listen for real-time updates
  useEffect(() => {
    // Load initial messages from server
    socket.on("load_messages", (msgs) => setMessages(msgs));

    // Listen for new messages from other users
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Clean up listeners on unmount
    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = { username, text: input };
    socket.emit("send_message", msg); // send message to server
    setInput("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to Rostgramm, {username}!</h2>
        <h3>Start chatting below:</h3>

        {/* Messages display */}
        <div
          style={{
            width: "300px",
            height: "300px",
            border: "1px solid white",
            margin: "20px 0",
            padding: "10px",
            overflowY: "auto",
            textAlign: "left",
            backgroundColor: "#282c34",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} style={{ margin: "5px 0" }}>
              <b>{msg.username}: </b>{msg.text}
            </div>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ padding: "8px", width: "200px" }}
          />
          <button type="submit" style={{ padding: "8px 16px", marginLeft: "10px" }}>
            Send
          </button>
        </form>
      </header>
    </div>
  );
}

export default Home;

