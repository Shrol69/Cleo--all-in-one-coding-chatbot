import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth } from "../firebase";
import {
  MessageCircle,
  User,
  Settings,
  Moon,
  Sun,
  Image,
  Mic,
  Smile,
  CheckCircle,
} from "react-feather";

const db = getFirestore();

const Sidebar = ({ darkMode, toggleDarkMode }) => (
  <div
    className={`w-64 p-8 ${
      darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
    } border-r h-screen fixed left-0 top-0`}
  >
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl text-center font-bold border-2 p-4">Chat Club</h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
    <nav className="space-y-2 p-4">
      <button
        className="flex text-base items-center space-x-3 p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-gray-100"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Chat</span>
      </button>
      <button
        className="flex text-base items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <User className="w-5 h-5" />
        <span>Account</span>
      </button>
      <button
        className="flex text-base items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </button>
    </nav>
  </div>
);

const PostMessage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messageList);
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "posts"), {
      message: message.trim(),
      timestamp: serverTimestamp(),
      user: auth.currentUser?.email || "Anonymous",
      read: false,
    });
    setMessage("");
    setIsTyping(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);
  };

  const handleReaction = async (messageId, reaction) => {
    const messageRef = doc(db, "posts", messageId);
    await updateDoc(messageRef, {
      reactions: { [auth.currentUser?.email]: reaction },
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    await addDoc(collection(db, "posts"), {
      file: fileURL,
      fileType: file.type,
      timestamp: serverTimestamp(),
      user: auth.currentUser?.email || "Anonymous",
    });
  };

  return (
    <div className={`flex ${darkMode ? "bg-gray-50" : "bg-gray-50"}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 ml-64">
        <div
          className={`p-4 border-b flex justify-between ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
          }`}
        >
          <h2 className="text-lg font-semibold">Chat Room</h2>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <span>{auth.currentUser?.displayName || "Guest"}</span>
          </div>
        </div>
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50"
          }`}
          style={{
            height: "calc(100vh - 150px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.user === auth.currentUser?.email
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-lg ${
                    msg.user === auth.currentUser?.email
                      ? darkMode
                        ? "bg-blue-500 text-white"
                        : "bg-blue-600 text-white"
                      : darkMode
                      ? "bg-gray-800 text-gray-100"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm font-medium">{msg.user}</p>
                  {msg.message && <p>{msg.message}</p>}
                  {msg.file && (
                    <>
                      {msg.fileType.startsWith("image/") && (
                        <img
                          src={msg.file}
                          alt="attachment"
                          className="max-w-full"
                        />
                      )}
                      {msg.fileType.startsWith("video/") && (
                        <video
                          src={msg.file}
                          controls
                          className="max-w-full"
                        ></video>
                      )}
                      {msg.fileType.startsWith("application/") && (
                        <a href={msg.file} download className="text-blue-500">
                          Download File
                        </a>
                      )}
                    </>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => handleReaction(msg.id, "❤️")}
                      className="text-red-500"
                    >
                      ❤️
                    </button>
                    <button
                      onClick={() => handleReaction(msg.id, "👍")}
                      className="text-blue-500"
                    >
                      👍
                    </button>
                  </div>
                  <p className="text-xs mt-1 text-right">
                    {msg.timestamp?.toDate().toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-right">
                    {msg.read ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      "Unread"
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages yet!</p>
          )}
          {isTyping && (
            <p className="text-sm italic text-gray-500">Someone is typing...</p>
          )}
        </div>
        <div
          className={`p-4 border-t flex items-center ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
          }`}
          style={{ position: "sticky", bottom: 0 }}
        >
          <textarea
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className={`flex-1 p-2 border rounded-lg focus:outline-none ${
              darkMode
                ? "bg-gray-700 text-gray-100 border-gray-600"
                : "bg-white border-gray-300"
            }`}
            rows="1"
          />
          <button
            onClick={handlePost}
            className="px-4 py-2 ml-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
          <label className="p-2 ml-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <Image className="w-5 h-5" />
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          <button className="p-2 ml-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <Mic className="w-5 h-5" />
          </button>
          <button className="p-2 ml-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            <Smile className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostMessage;
