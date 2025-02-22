import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { FaMicrophone, FaComment, FaImage, FaHome, FaVideo, FaBars } from "react-icons/fa";

const socket = io("http://localhost:5000"); // Replace with backend URL when deployed

export default function HomeScreen() {
  const [searchHistory, setSearchHistory] = useState([
    "Recommendation for colours...",
    "How should my UX design p...",
  ]);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-black text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <FaBars className="text-2xl" />
        <h1 className="text-2xl font-bold">Hello, <span className="text-green-400">James</span></h1>
        <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
          <img src="/user-avatar.png" alt="User" className="w-full h-full" />
        </div>
      </header>

      <h2 className="text-lg mb-4">How can I assist you right now?</h2>
      
      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-500 p-4 rounded-xl flex flex-col items-center">
          <FaMicrophone className="text-3xl" />
          <p className="mt-2">Talk with Echo</p>
        </div>
        <div className="bg-green-300 p-4 rounded-xl flex flex-col items-center">
          <FaComment className="text-3xl" />
          <p className="mt-2">Chat With Echo</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-xl flex flex-col items-center">
          <FaImage className="text-3xl" />
          <p className="mt-2">Search By Image</p>
        </div>
        <div className="bg-blue-500 p-4 rounded-xl flex flex-col items-center">
          <FaVideo className="text-3xl" />
          <p className="mt-2">Start Video Call</p>
        </div>
      </div>

      {/* Recent Searches */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg">Recent Search</h3>
        <button className="text-green-400">View All</button>
      </div>
      <div className="space-y-2">
        {searchHistory.map((search, index) => (
          <div key={index} className="bg-gray-800 p-3 rounded-xl flex items-center">
            <span className="flex-1">{search}</span>
          </div>
        ))}
      </div>

      {/* Real-Time Chat */}
      <h2 className="text-lg mt-6 mb-2">Real-Time Chat</h2>
      <div className="border border-gray-400 p-4 h-48 overflow-y-scroll bg-gray-800 rounded-md">
        {messages.map((msg, index) => (
          <p key={index} className="text-white">{msg}</p>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-700 text-white rounded-l-md"
        />
        <button onClick={sendMessage} className="p-2 bg-green-500 rounded-r-md">Send</button>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 w-full flex justify-around p-4 bg-black bg-opacity-30">
        <button className="flex flex-col items-center text-white">
          <FaHome className="text-2xl" />
          <span className="text-sm">Home</span>
        </button>
      </footer>
    </div>
  );
}
