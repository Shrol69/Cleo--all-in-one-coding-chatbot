import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FaMicrophone, FaComment, FaImage, FaHome, FaVideo, FaBars, FaPaperPlane, FaMoon, FaSun } from "react-icons/fa";

const socket = io("http://localhost:5000"); // Change for deployment

export default function HomeScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, { text: data, isOwn: false }]);
    });

    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { text: message, isOwn: true }]);
      socket.emit("message", message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-gray-900"} p-6`}>
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <FaBars className="text-2xl cursor-pointer" />
        <h1 className="text-2xl font-bold">
          Hello, <span className="text-green-400">James</span>
        </h1>
        <button onClick={() => setDarkMode(!darkMode)} className="text-xl p-2 rounded-md">
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
        </button>
      </header>

      <h2 className="text-lg mb-4">How can I assist you today?</h2>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="bg-green-500 p-4 rounded-xl flex flex-col items-center hover:bg-green-600 transition">
          <FaMicrophone className="text-3xl" />
          <p className="mt-2">Talk with Echo</p>
        </button>
        <button className="bg-green-300 p-4 rounded-xl flex flex-col items-center hover:bg-green-400 transition">
          <FaComment className="text-3xl" />
          <p className="mt-2">Chat With Echo</p>
        </button>
        <button className="bg-gray-700 p-4 rounded-xl flex flex-col items-center hover:bg-gray-600 transition">
          <FaImage className="text-3xl" />
          <p className="mt-2">Search By Image</p>
        </button>
        <button className="bg-blue-500 p-4 rounded-xl flex flex-col items-center hover:bg-blue-600 transition">
          <FaVideo className="text-3xl" />
          <p className="mt-2">Start Video Call</p>
        </button>
      </div>

      {/* Real-Time Chat */}
      <h2 className="text-lg mt-6 mb-2">Real-Time Chat</h2>
      <div ref={chatRef} className="border border-gray-400 p-4 h-48 overflow-y-scroll bg-gray-800 rounded-md flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 my-1 max-w-xs rounded-xl ${msg.isOwn ? "bg-green-500 self-end text-white" : "bg-gray-600 self-start text-white"} shadow-md`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 bg-gray-700 text-white rounded-l-md focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className={`p-3 rounded-r-md ${message.trim() ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"} transition`}
        >
          <FaPaperPlane />
        </button>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 w-full flex justify-around p-4 bg-black bg-opacity-30 backdrop-blur-lg rounded-lg">
        <button className="flex flex-col items-center text-white hover:text-green-400 transition">
          <FaHome className="text-2xl" />
          <span className="text-sm">Home</span>
        </button>
        <button className="flex flex-col items-center text-white hover:text-green-400 transition">
          <FaComment className="text-2xl" />
          <span className="text-sm">Chat</span>
        </button>
        <button className="flex flex-col items-center text-white hover:text-green-400 transition">
          <FaVideo className="text-2xl" />
          <span className="text-sm">Call</span>
        </button>
      </footer>
    </div>
  );
}
